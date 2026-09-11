/**
 * BranchesModel.js
 * Manages video branch definitions, playback timings, terminal hold guards, and active state.
 */
export const BranchesModel = {
  branches: {
    clothing: {
      name: 'Clothing',
      fwdId: 'vid-clothing-fwd',
      revId: 'vid-clothing-rev',
      fwdDuration: 2.08,
      revDuration: 2.08,
      fwdHoldGuard: 0.08,
      revHoldGuard: 0.08
    },
    scene: {
      name: 'Scene',
      fwdId: 'vid-scene-fwd',
      revId: 'vid-scene-rev',
      fwdDuration: 2.08,
      revDuration: 2.08,
      fwdHoldGuard: 0.08,
      revHoldGuard: 0.18 // Verified empirically
    },
    lighting: {
      name: 'Lighting',
      fwdId: 'vid-lighting-fwd',
      revId: 'vid-lighting-rev',
      fwdDuration: 2.08,
      revDuration: 2.04,
      fwdHoldGuard: 0.08,
      revHoldGuard: 0.08
    },
    cast: {
      name: 'Cast',
      fwdId: 'vid-cast-fwd',
      revId: 'vid-cast-rev',
      fwdDuration: 3.00,
      revDuration: 2.48,
      fwdHoldGuard: 0.08,
      revHoldGuard: 0.08
    }
  },

  positions: {
    0: { left: '-5px', width: 'calc(20% + 5px)' },
    1: { left: '20%', width: '20%' },
    2: { left: '40%', width: '20%' },
    3: { left: '60%', width: '20%' },
    4: { left: '80%', width: 'calc(20% + 5px)' }
  },

  currentState: 'base',
  isTransitioning: false,
  activeToken: 0,
  focusedIndexBeforeAction: null,
  currentActiveButton: null,

  getBranch(branchKey) {
    return this.branches[branchKey] || null;
  },

  getPosition(index) {
    return this.positions[index] || this.positions[0];
  },

  setState(newState) {
    this.currentState = newState;
  },

  getState() {
    return this.currentState;
  },

  setTransitioning(val) {
    this.isTransitioning = val;
  },

  getTransitioning() {
    return this.isTransitioning;
  },

  nextActiveToken() {
    return ++this.activeToken;
  },

  getActiveToken() {
    return this.activeToken;
  }
};
