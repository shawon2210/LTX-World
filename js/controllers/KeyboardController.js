/**
 * KeyboardController.js
 * Handles keyboard shortcuts (1-4 for branches, R/Space for reset, ? for help modal, Escape for closing modals).
 */

export class KeyboardController {
  /**
   * @param {import('./PlayerController.js').PlayerController} playerController 
   * @param {import('../views/ModalView.js').ModalView} modalView 
   */
  constructor(playerController, modalView) {
    this.playerController = playerController;
    this.modalView = modalView;
    this.branchKeyMap = {
      '1': 'scene',
      '2': 'lighting',
      '3': 'clothing',
      '4': 'cast'
    };
  }

  init() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    // If typing in input, textarea, or contentEditable, ignore shortcut
    const active = document.activeElement;
    if (active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable ||
      active.classList.contains('prompt-input')
    )) {
      return;
    }

    const key = e.key;

    if (key === 'Escape') {
      this.modalView.closeAll();
      return;
    }

    if (key === '?' || (e.shiftKey && key === '/')) {
      e.preventDefault();
      this.modalView.open('shortcuts-modal');
      return;
    }

    if (key === ' ' || key === 'r' || key === 'R') {
      e.preventDefault();
      this.playerController.resetToMain();
      return;
    }

    if (this.branchKeyMap[key]) {
      e.preventDefault();
      const branch = this.branchKeyMap[key];
      this.playerController.selectBranch(branch);
    }
  }
}
