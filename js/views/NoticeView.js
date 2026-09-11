/**
 * NoticeView.js
 * Polite live region for screen-reader announcements and error alerts.
 */
export class NoticeView {
  constructor() {
    this.liveRegion = null;
  }

  init() {
    this.liveRegion = document.getElementById('aria-live-status');
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'aria-live-status';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      document.body.appendChild(this.liveRegion);
    }
  }

  announce(message, isError) {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', isError ? 'assertive' : 'polite');
    this.liveRegion.textContent = '';
    var self = this;
    requestAnimationFrame(function() { self.liveRegion.textContent = message; });
  }
}