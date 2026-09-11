/**
 * PlayerController.js
 * Core playback state machine: handles branch selection, forward/reverse transitions,
 * seam-safe first-frame decode (requestVideoFrameCallback), timeupdate hold guards,
 * capsule animation, and Reset lifecycle.
 */
export class PlayerController {
  /**
   * @param {import('../models/BranchesModel.js').BranchesModel} model
   * @param {import('../views/StageView.js').StageView}          stageView
   * @param {import('../views/ControllerView.js').ControllerView} controllerView
   * @param {import('../views/NoticeView.js').NoticeView}         noticeView
   */
  constructor(model, stageView, controllerView, noticeView) {
    this.model          = model;
    this.stageView      = stageView;
    this.controllerView = controllerView;
    this.noticeView     = noticeView;
    this.onStateChange  = null; // optional external hook
  }

  init() {
    this.stageView.init();
    this.controllerView.init();

    var self = this;

    // Bind each branch button
    var btns = this.controllerView.getBranchButtons();
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // If this button is showing 'Reset', do a reverse
        if (btn.classList.contains('is-reset')) {
          self._doReverse();
          return;
        }
        var branchKey = btn.dataset.branch;
        self._handleBranchClick(branchKey, btn);
      });
    });

    // Set initial capsule
    this.controllerView.updateCapsulePosition('base');
  }

  // ── Public helpers ──────────────────────────────────────────────────────

  /** Keyboard shortcut: select by branch key */
  selectBranch(branchKey) {
    if (this.model.isBusy()) return;

    var btn = null;
    var btns = this.controllerView.getBranchButtons();
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].dataset.branch === branchKey) { btn = btns[i]; break; }
    }
    if (!btn) return;

    if (btn.classList.contains('is-reset')) {
      this._doReverse();
      return;
    }
    this._handleBranchClick(branchKey, btn);
  }

  /** Keyboard shortcut: reset to base */
  resetToMain() {
    if (this.model.isBusy() || this.model.isBase()) return;
    this._doReverse();
  }

  // ── Private ─────────────────────────────────────────────────────────────

  _handleBranchClick(branchKey, btn) {
    if (this.model.isBusy()) return;
    if (this.model.isCurrent(branchKey)) return; // already there

    if (this.model.isBase()) {
      this._doForward(branchKey, btn);
    } else {
      // Cross-branch: reverse first, then forward
      var self = this;
      this._doReverse(function() {
        if (branchKey !== 'base') {
          self._doForward(branchKey, btn);
        }
      });
    }
  }

  _doForward(branchKey, btn) {
    var branch = this.model.getBranch(branchKey);
    if (!branch) return;

    var myToken = this.model.nextToken();
    this.model.setTransitioning(true);
    this.controllerView.setDisabled(true);

    var video     = this.stageView.getVideo(branchKey, 'fwd');
    var holdGuard = branch.fwdHoldGuard;
    var self      = this;

    this._prepareAndPlay(video, function() {
      if (self.model.getToken() !== myToken) return; // stale

      self.stageView.showVideo(branchKey, 'fwd');
      self.stageView.hideTitle();
      self.model.setState(branchKey);
      self.controllerView.updateActiveState(branchKey);
      self.controllerView.updateCapsulePosition(branchKey);

      self._monitorAndHold(video, holdGuard, function() {
        if (self.model.getToken() !== myToken) return;
        self.model.setTransitioning(false);
        self.controllerView.pulseReset(btn);
        self.noticeView.announce(branchKey.toUpperCase() + ' applied. Click Reset to return.');
        if (self.onStateChange) self.onStateChange(branchKey);
      });
    }, function(err) {
      console.warn('[Player] Forward error ('+branchKey+')', err);
      self.model.setTransitioning(false);
      self.controllerView.setDisabled(false);
      self.noticeView.announce('Playback error on ' + branchKey, true);
    });
  }

  _doReverse(onComplete) {
    var branchKey = this.model.currentState;
    var branch    = this.model.getBranch(branchKey);
    if (!branch) { if (onComplete) onComplete(); return; }

    var myToken = this.model.nextToken();
    this.model.setTransitioning(true);

    var video     = this.stageView.getVideo(branchKey, 'rev');
    var holdGuard = branch.revHoldGuard;
    var self      = this;

    // Restore controller UI immediately so it looks responsive
    this.controllerView.restoreFromReset();

    this._prepareAndPlay(video, function() {
      if (self.model.getToken() !== myToken) return;

      self.stageView.showVideo(branchKey, 'rev');
      self.model.setState('base');
      self.controllerView.updateActiveState('base');
      self.controllerView.updateCapsulePosition('base');

      // Fade title back in after a small delay (12% of duration, max 0.9s)
      var dur        = (video.duration && isFinite(video.duration)) ? video.duration : 2.5;
      var titleDelay = Math.min(dur * 0.12, 0.9) * 1000;
      setTimeout(function() {
        if (self.model.currentState === 'base') self.stageView.showTitle();
      }, titleDelay);

      self._monitorAndHold(video, holdGuard, function() {
        if (self.model.getToken() !== myToken) return;
        self.model.setTransitioning(false);
        self.noticeView.announce('Scene reset to base.');
        if (self.onStateChange) self.onStateChange('base');
        if (typeof onComplete === 'function') onComplete();
      });
    }, function(err) {
      console.warn('[Player] Reverse error ('+branchKey+')', err);
      self.model.setTransitioning(false);
      self.noticeView.announce('Reset error', true);
    });
  }

  /**
   * Seek to 0, register first-frame callback, then play.
   * Calls onFirstFrame() when the very first decoded frame is ready (seam-safe).
   */
  _prepareAndPlay(videoEl, onFirstFrame, onError) {
    if (!videoEl) { if (onError) onError(new Error('Missing video element')); return; }

    videoEl.pause();
    videoEl.currentTime = 0;

    var fired = false;
    var trigger = function() {
      if (fired) return;
      fired = true;
      onFirstFrame();
    };

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      videoEl.requestVideoFrameCallback(function(now, meta) {
        if (meta && meta.mediaTime <= 0.5 && videoEl.readyState >= 2) trigger();
        else requestAnimationFrame(trigger);
      });
    } else {
      videoEl.addEventListener('playing', function handler() {
        videoEl.removeEventListener('playing', handler);
        requestAnimationFrame(function() { requestAnimationFrame(trigger); });
      }, { once: true });
    }

    var p = videoEl.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function(e) {
        if (e.name !== 'AbortError') { if (onError) onError(e); }
      });
    }
  }

  /**
   * Watch timeupdate; pause and call onHold() when remaining time <= holdGuard.
   */
  _monitorAndHold(videoEl, holdGuard, onHold) {
    if (!videoEl) return;
    var held = false;

    var checkTime = function() {
      if (held) return;
      if (videoEl.duration && (videoEl.duration - videoEl.currentTime) <= holdGuard) {
        held = true;
        videoEl.pause();
        videoEl.removeEventListener('timeupdate', checkTime);
        onHold();
      }
    };

    var onEnded = function() {
      if (!held) { held = true; videoEl.pause(); onHold(); }
    };

    videoEl.addEventListener('timeupdate', checkTime);
    videoEl.addEventListener('ended', onEnded, { once: true });
  }
}