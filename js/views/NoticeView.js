/**
 * NoticeView.js
 * Encapsulates the screen reader live status region, error alert banners, and retry handler.
 */
export const NoticeView = {
  statusLive: document.getElementById('status-live'),
  notice: document.getElementById('notice'),
  noticeMsg: document.getElementById('notice-msg'),
  btnRetry: document.getElementById('btn-retry'),
  lastRetryCallback: null,

  announce(message) {
    if (this.statusLive) {
      this.statusLive.textContent = message;
    }
  },

  showError(message, retryCallback) {
    if (this.noticeMsg) this.noticeMsg.textContent = message;
    if (this.notice) {
      this.notice.classList.add('visible');
      this.notice.setAttribute('aria-hidden', 'false');
    }
    this.lastRetryCallback = retryCallback;
    this.announce(`Error: ${message}`);
  },

  hideNotice() {
    if (this.notice) {
      this.notice.classList.remove('visible');
      this.notice.setAttribute('aria-hidden', 'true');
    }
  },

  init(onRetry) {
    if (this.btnRetry) {
      this.btnRetry.addEventListener('click', () => {
        this.hideNotice();
        if (typeof this.lastRetryCallback === 'function') {
          this.lastRetryCallback();
        } else if (typeof onRetry === 'function') {
          onRetry();
        }
      });
    }
  }
};
