/**
 * ControllerView.js
 * Manages the glass floating controller bar, capsule sliding, active states, hover effects,
 * collapse/expand mechanics and the Reset button pulse.
 */
export class ControllerView {
  constructor() {
    this.controller    = null;
    this.cells         = null;
    this.branchBtns    = [];
    this.allCells      = [];
    this.activeBranchBtn = null;
    this._originalLabel  = null;
  }

  init() {
    this.controller = document.getElementById('controller');
    this.cells      = document.getElementById('cells');
    if (!this.cells) return;

    this.branchBtns = Array.prototype.slice.call(this.cells.querySelectorAll('button[data-branch]'));
    this.allCells   = Array.prototype.slice.call(this.cells.children);

    var self = this;
    if (this.controller) {
      this.controller.addEventListener('mousemove', function(e) {
        var rect = self.controller.getBoundingClientRect();
        var xPct = ((e.clientX - rect.left) / rect.width)  * 100;
        var yPct = ((e.clientY - rect.top)  / rect.height) * 100;
        self.controller.style.setProperty('--glass-x', xPct.toFixed(2) + '%');
        self.controller.style.setProperty('--glass-y', yPct.toFixed(2) + '%');
        self.controller.classList.add('has-hover');
      });
      this.controller.addEventListener('mouseleave', function() {
        self.controller.classList.remove('has-hover');
      });
    }

    // Initial capsule on the label cell (position 0)
    this._setCapsule('-5px', 'calc(20% + 5px)');
  }

  getBranchButtons() {
    return this.branchBtns;
  }

  setDisabled(val) {
    this.branchBtns.forEach(function(btn) { btn.disabled = val; });
  }

  updateActiveState(currentState) {
    var self = this;
    this.branchBtns.forEach(function(btn) {
      var isActive = (btn.dataset.branch === currentState);
      btn.classList.toggle('active', isActive);
      if (isActive) self.activeBranchBtn = btn;
    });
  }

  /** Slide capsule to cover the active branch button, or back to label if base */
  updateCapsulePosition(currentState) {
    if (!this.controller) return;
    if (!currentState || currentState === 'base') {
      this._setCapsule('-5px', 'calc(20% + 5px)');
      return;
    }
    var btn = null;
    for (var i = 0; i < this.branchBtns.length; i++) {
      if (this.branchBtns[i].dataset.branch === currentState) { btn = this.branchBtns[i]; break; }
    }
    if (!btn) return;
    var cr = this.controller.getBoundingClientRect();
    var br = btn.getBoundingClientRect();
    this._setCapsule((br.left - cr.left).toFixed(2) + 'px', br.width.toFixed(2) + 'px');
  }

  /** After forward transition: convert the clicked button to a Reset button and collapse the bar */
  pulseReset(activeBranchBtn) {
    if (!activeBranchBtn) activeBranchBtn = this.activeBranchBtn;
    if (!activeBranchBtn) return;
    this.activeBranchBtn  = activeBranchBtn;
    this._originalLabel   = activeBranchBtn.textContent;

    // Disable all other buttons
    var self = this;
    this.branchBtns.forEach(function(b) {
      if (b !== activeBranchBtn) {
        b.disabled = true;
        b.setAttribute('aria-hidden', 'true');
        b.setAttribute('tabindex', '-1');
      }
    });

    // Turn active btn into Reset
    activeBranchBtn.textContent = 'Reset';
    activeBranchBtn.classList.add('is-reset');
    activeBranchBtn.disabled = false;
    activeBranchBtn.removeAttribute('aria-hidden');
    activeBranchBtn.setAttribute('aria-label', 'Reset to base scene');

    // Collapse controller visually
    if (this.controller) {
      this.controller.classList.add('collapsed');
      this.controller.classList.remove('has-hover');
    }
    this.allCells.forEach(function(cell) {
      if (cell !== activeBranchBtn) {
        cell.classList.add('fade-out');
        cell.setAttribute('aria-hidden', 'true');
      }
    });
    this._centreButton(activeBranchBtn);
  }

  /** Restore the controller bar after reset */
  restoreFromReset() {
    var btn   = this.activeBranchBtn;
    var label = this._originalLabel;

    if (this.controller) this.controller.classList.remove('collapsed');

    if (btn) {
      btn.textContent = label || btn.dataset.branch;
      btn.classList.remove('is-reset', 'active');
      btn.style.transform = '';
      btn.removeAttribute('aria-label');
    }

    this.allCells.forEach(function(cell) {
      cell.classList.remove('fade-out');
      cell.removeAttribute('aria-hidden');
    });
    this.branchBtns.forEach(function(b) {
      b.disabled = false;
      b.removeAttribute('aria-hidden');
      b.removeAttribute('tabindex');
    });

    this.activeBranchBtn = null;
    this._originalLabel  = null;
    // Reset capsule to label position
    this._setCapsule('-5px', 'calc(20% + 5px)');
  }

  // ── Private ────────────────────────────────────────────────────────────

  _setCapsule(left, width) {
    if (!this.controller) return;
    this.controller.style.setProperty('--cap-left',  left);
    this.controller.style.setProperty('--cap-width', width);
  }

  _centreButton(btn) {
    if (!btn || !this.controller) return;
    var cr  = this.controller.getBoundingClientRect();
    var ccx = cr.left + cr.width  / 2;
    var ccy = cr.top  + cr.height / 2;
    btn.style.transform = '';
    var br  = btn.getBoundingClientRect();
    var bcx = br.left + br.width  / 2;
    var bcy = br.top  + br.height / 2;
    btn.style.transform = 'translate(' + (ccx - bcx).toFixed(2) + 'px,' + (ccy - bcy).toFixed(2) + 'px)';
  }
}