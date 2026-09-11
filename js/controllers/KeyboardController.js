/**
 * KeyboardController.js
 * Binds keyboard shortcuts: 1-4 for branches, R/Space for reset, ? for help, Esc to close modals.
 */
export class KeyboardController {
  constructor(playerController, modalView) {
    this.player    = playerController;
    this.modalView = modalView;
    this.keyMap    = { '1': 'scene', '2': 'lighting', '3': 'clothing', '4': 'cast' };
  }

  init() {
    var self = this;
    window.addEventListener('keydown', function(e) { self._handle(e); });
  }

  _handle(e) {
    // Ignore when typing in inputs
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) return;

    var k = e.key;

    if (k === 'Escape') { this.modalView.closeAll(); return; }
    if (k === '?' || (e.shiftKey && k === '/')) { e.preventDefault(); this.modalView.open('shortcuts-modal'); return; }
    if (k === ' ' || k === 'r' || k === 'R') { e.preventDefault(); this.player.resetToMain(); return; }
    if (this.keyMap[k]) { e.preventDefault(); this.player.selectBranch(this.keyMap[k]); }
  }
}