/**
 * StageView.js
 * Manages 8 persistent video DOM elements, active video switching, and hero title visibility.
 */
export class StageView {
  constructor() {
    this.stage = null;
    this.allVideos = [];
    this.activeVideo = null;
  }

  init() {
    this.stage = document.getElementById('stage');
    this.allVideos = Array.prototype.slice.call(document.querySelectorAll('.media'));
    var active = document.querySelector('.media.active');
    this.activeVideo = active || this.allVideos[0] || null;
  }

  getVideo(branchKey, direction) {
    return document.getElementById('vid-' + branchKey + '-' + direction);
  }

  showVideo(branchKey, direction) {
    var target = this.getVideo(branchKey, direction);
    if (!target) return;
    if (this.activeVideo && this.activeVideo !== target) {
      this.activeVideo.classList.remove('active');
    }
    target.classList.add('active');
    this.activeVideo = target;
  }

  hideTitle() {
    if (this.stage) this.stage.classList.add('title-hidden');
  }

  showTitle() {
    if (this.stage) this.stage.classList.remove('title-hidden');
  }
}