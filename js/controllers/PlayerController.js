/**
 * PlayerController.js
 * Controls the playback lifecycle, video transitions, first-frame decode callbacks,
 * timeupdate hold guards, and state synchronization with Views and Models.
 */

export class PlayerController {
  /**
   * @param {import('../models/BranchesModel.js').BranchesModel} branchesModel 
   * @param {import('../views/StageView.js').StageView} stageView 
   * @param {import('../views/ControllerView.js').ControllerView} controllerView 
   * @param {import('../views/NoticeView.js').NoticeView} noticeView 
   */
  constructor(branchesModel, stageView, controllerView, noticeView) {
    this.model = branchesModel;
    this.stageView = stageView;
    this.controllerView = controllerView;
    this.noticeView = noticeView;
    this.onStateChange = null;
  }

  init() {
    this.stageView.init();
    this.controllerView.init();

    // Bind controller button clicks
    const btns = this.controllerView.getBranchButtons();
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const branchKey = btn.dataset.branch;
        this.selectBranch(branchKey);
      });
    });

    const resetBtn = this.controllerView.getResetButton();
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToMain();
      });
    }

    // Set initial active state on buttons
    this.updateControlsUI();
  }

  selectBranch(branchKey) {
    if (this.model.isBusy()) return;
    if (this.model.isCurrent(branchKey)) return;

    if (this.model.currentBranch === 'main') {
      this.playForward(branchKey);
    } else {
      this.playReverse(() => {
        if (branchKey !== 'main') {
          this.playForward(branchKey);
        }
      });
    }
  }

  resetToMain() {
    if (this.model.isBusy() || this.model.currentBranch === 'main') return;
    this.playReverse();
  }

  playForward(targetBranch) {
    if (this.model.isBusy()) return;

    this.model.isTransitioning = true;
    this.controllerView.setDisabled(true);

    const fwdVideo = this.stageView.getVideo(targetBranch, 'fwd');
    const fwdConfig = this.model.getConfig(targetBranch, 'fwd');
    const holdGuard = fwdConfig ? fwdConfig.holdGuard : 0.08;

    this.prepareAndPlay(fwdVideo, () => {
      this.stageView.showVideo(targetBranch, 'fwd');
      this.stageView.hideTitle();
      this.model.currentBranch = targetBranch;
      this.updateControlsUI();

      this.monitorAndHold(fwdVideo, holdGuard, () => {
        this.model.isTransitioning = false;
        this.controllerView.setDisabled(false);
        this.controllerView.pulseReset();
        this.noticeView.announce(targetBranch.toUpperCase() + ' transition complete. You can reset or select another branch.');
        if (this.onStateChange) this.onStateChange(this.model.getState());
      });
    }, (err) => {
      console.error('[PlayerController] Forward playback error (' + targetBranch + '):', err);
      this.model.isTransitioning = false;
      this.controllerView.setDisabled(false);
      this.noticeView.announce('Playback error on ' + targetBranch + '. Please try again.', true);
    });
  }

  playReverse(onComplete) {
    if (this.model.isBusy() || this.model.currentBranch === 'main') return;

    this.model.isTransitioning = true;
    this.controllerView.setDisabled(true);
    const branch = this.model.currentBranch;

    const revVideo = this.stageView.getVideo(branch, 'rev');
    const revConfig = this.model.getConfig(branch, 'rev');
    const holdGuard = revConfig ? revConfig.holdGuard : 0.08;

    this.prepareAndPlay(revVideo, () => {
      this.stageView.showVideo(branch, 'rev');
      this.model.currentBranch = 'main';
      this.updateControlsUI();

      const duration = revVideo.duration || 3.0;
      const titleDelay = Math.min(duration * 0.12, 0.9) * 1000;
      setTimeout(() => {
        if (this.model.currentBranch === 'main') {
          this.stageView.showTitle();
        }
      }, titleDelay);

      this.monitorAndHold(revVideo, holdGuard, () => {
        this.model.isTransitioning = false;
        this.controllerView.setDisabled(false);
        this.noticeView.announce('Scene reset to default baseline.');
        if (this.onStateChange) this.onStateChange(this.model.getState());
        if (typeof onComplete === 'function') {
          onComplete();
        }
      });
    }, (err) => {
      console.error('[PlayerController] Reverse playback error (' + branch + '):', err);
      this.model.isTransitioning = false;
      this.controllerView.setDisabled(false);
      this.noticeView.announce('Reset error on ' + branch + '.', true);
    });
  }

  prepareAndPlay(videoEl, onFirstFrame, onError) {
    if (!videoEl) {
      if (onError) onError(new Error('Video element not found'));
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      if (onFirstFrame) onFirstFrame();
    };

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      videoEl.requestVideoFrameCallback((now, metadata) => {
        if (metadata && metadata.mediaTime <= 0.5 && videoEl.readyState >= 2) {
          trigger();
        } else {
          requestAnimationFrame(trigger);
        }
      });
    } else {
      const handlePlaying = () => {
        videoEl.removeEventListener('playing', handlePlaying);
        requestAnimationFrame(() => {
          requestAnimationFrame(trigger);
        });
      };
      videoEl.addEventListener('playing', handlePlaying, { once: true });
    }

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[PlayerController] Play failure:', err);
          if (onError) onError(err);
        }
      });
    }
  }

  monitorAndHold(videoEl, holdGuard, onHold) {
    if (!videoEl) return;

    let held = false;
    const checkHold = () => {
      if (held) return;
      if (videoEl.duration && (videoEl.duration - videoEl.currentTime <= holdGuard)) {
        held = true;
        videoEl.pause();
        videoEl.removeEventListener('timeupdate', checkHold);
        videoEl.removeEventListener('ended', onEnd);
        if (onHold) onHold();
      }
    };

    const onEnd = () => {
      if (!held) {
        held = true;
        videoEl.pause();
        videoEl.removeEventListener('timeupdate', checkHold);
        videoEl.removeEventListener('ended', onEnd);
        if (onHold) onHold();
      }
    };

    videoEl.addEventListener('timeupdate', checkHold);
    videoEl.addEventListener('ended', onEnd, { once: true });
  }

  updateControlsUI() {
    this.controllerView.updateActiveState(this.model.currentBranch);
    this.controllerView.updateCapsulePosition();
  }
}
