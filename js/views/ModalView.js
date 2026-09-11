/**
 * ModalView.js
 * Encapsulates modal overlays (Specs, API, Shortcuts) and the interactive toast notification.
 */
export const ModalView = {
  specsModal: document.getElementById('specs-modal'),
  apiModal: document.getElementById('api-modal'),
  shortcutsModal: document.getElementById('shortcuts-modal'),
  toast: document.getElementById('toast'),
  toastTimer: null,

  openModal(modalElement) {
    if (modalElement) modalElement.classList.add('active');
  },

  closeModal(modalElement) {
    if (modalElement) modalElement.classList.remove('active');
  },

  toggleModal(modalElement) {
    if (modalElement) modalElement.classList.toggle('active');
  },

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add('visible');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove('visible');
    }, 2600);
  }
};
