/**
 * HardwareSpecsModel.js
 * Computes live estimates for latency, frame counts, VRAM memory footprints, and recommended GPU tiers.
 */
export const HardwareSpecsModel = {
  resMap: {
    1: { label: '720p HD', mult: 0.55, vramBase: 8.5 },
    2: { label: '1080p Full HD', mult: 1.0, vramBase: 14.2 },
    3: { label: '1440p 2K', mult: 1.75, vramBase: 18.0 },
    4: { label: '4K Ultra HD', mult: 3.8, vramBase: 28.5 }
  },

  fpsMap: {
    1: { label: '24 FPS', fps: 24, mult: 0.8 },
    2: { label: '30 FPS', fps: 30, mult: 1.0 },
    3: { label: '60 FPS', fps: 60, mult: 1.9 }
  },

  calculate(resIndex, fpsIndex, durationSec) {
    const curRes = this.resMap[resIndex] || this.resMap[2];
    const curFps = this.fpsMap[fpsIndex] || this.fpsMap[2];
    const totalFrames = durationSec * curFps.fps;

    const estSeconds = (2.08 * (durationSec / 5.0) * curRes.mult * curFps.mult).toFixed(2);
    const estVram = (curRes.vramBase + (durationSec > 5 ? (durationSec - 5) * 0.8 : 0)).toFixed(1);

    let recGpu = 'RTX 3080 / 4070';
    if (estVram > 24) {
      recGpu = 'NVIDIA A100 / H100 (80GB)';
    } else if (estVram > 16) {
      recGpu = 'NVIDIA RTX 4090 / A6000';
    } else if (estVram > 12) {
      recGpu = 'RTX 4090 / A100 (16GB)';
    }

    return {
      resLabel: curRes.label,
      fpsLabel: curFps.label,
      durLabel: `${durationSec.toFixed(1)}s (${totalFrames} frames)`,
      estSeconds: `${estSeconds}s`,
      estVram: `${estVram} GB`,
      recGpu
    };
  }
};
