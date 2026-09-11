/**
 * BranchesModel.js
 * Manages video branch definitions, timings, hold guards, capsule positions, and state machine.
 */
export class BranchesModel {
  constructor() {
    this.branches = {
      scene:    { name: 'Scene',    fwdId: 'vid-scene-fwd',    revId: 'vid-scene-rev',    fwdHoldGuard: 0.08, revHoldGuard: 0.18 },
      lighting: { name: 'Lighting', fwdId: 'vid-lighting-fwd', revId: 'vid-lighting-rev', fwdHoldGuard: 0.08, revHoldGuard: 0.08 },
      clothing: { name: 'Clothing', fwdId: 'vid-clothing-fwd', revId: 'vid-clothing-rev', fwdHoldGuard: 0.08, revHoldGuard: 0.08 },
      cast:     { name: 'Cast',     fwdId: 'vid-cast-fwd',     revId: 'vid-cast-rev',     fwdHoldGuard: 0.08, revHoldGuard: 0.08 }
    };

    // Maps button index to capsule position
    // Index 0 = label cell (Select state), 1-4 = branch buttons
    this.capsulePositions = {
      0: { left: '-5px', width: 'calc(20% + 5px)' },
      1: { left: '20%',  width: '20%' },
      2: { left: '40%',  width: '20%' },
      3: { left: '60%',  width: '20%' },
      4: { left: '80%',  width: 'calc(20% + 5px)' }
    };

    this.branchIndexMap = { scene: 1, lighting: 2, clothing: 3, cast: 4 };

    this.currentState = 'base'; // 'base' or branch key
    this.isTransitioning = false;
    this.activeToken = 0;
    this.currentActiveButton = null;
  }

  getBranch(key) {
    return this.branches[key] || null;
  }

  getCapsulePosition(index) {
    return this.capsulePositions[index] || this.capsulePositions[0];
  }

  getBranchIndex(key) {
    return this.branchIndexMap[key] || 0;
  }

  isBusy() {
    return this.isTransitioning;
  }

  isBase() {
    return this.currentState === 'base';
  }

  isCurrent(branchKey) {
    return this.currentState === branchKey;
  }

  setState(newState) {
    this.currentState = newState;
  }

  setTransitioning(val) {
    this.isTransitioning = val;
  }

  nextToken() {
    return ++this.activeToken;
  }

  getToken() {
    return this.activeToken;
  }
}
