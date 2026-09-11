/**
 * StageView.js
 * Encapsulates the stage container, 8 persistent video DOM elements, and the hero title animation.
 */
export const StageView = {
  stage: document.getElementById('stage'),
  videos: {
    'clothing-fwd': document.getElementById('vid-clothing-fwd'),
    'clothing-rev': document.getElementById('vid-clothing-rev'),
    'scene-fwd': document.getElementById('vid-scene-fwd'),
    'scene-rev': document.getElementById('vid-scene-rev'),
    'lighting-fwd': document.getElementById('vid-lighting-fwd'),
    'lighting-rev': document.getElementById('vid-lighting-rev'),
    'cast-fwd': document.getElementById('vid-cast-fwd'),
    'cast-rev': document.getElementById('vid-cast-rev')
  },
  currentVisibleVideo: null,

  init() {
    this.currentVisibleVideo = this.videos['clothing-fwd'];
    if (this.currentVisibleVideo) {
      this.currentVisibleVideo.currentTime = 0;
      this.currentVisibleVideo.pause();
    }
  },

  getVideoById(id) {
    return document.getElementById(id);
  },

  setActiveVideo(targetVideo) {
    if (this.currentVisibleVideo && this.currentVisibleVideo !== targetVideo) {
      this.currentVisibleVideo.classList.remove('active');
    }
    targetVideo.classList.add('active');
    this.currentVisibleVideo = targetVideo;
  },

  hideTitle() {
    if (this.stage) this.stage.classList.add('title-hidden');
  },

  showTitle() {
    if (this.stage) this.stage.classList.remove('title-hidden');
  },

  getCurrentVisibleVideo() {
    return this.currentVisibleVideo;
  }
};
