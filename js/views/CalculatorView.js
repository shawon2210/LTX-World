/**
 * CalculatorView.js
 * Encapsulates the benchmark latency and hardware estimator UI.
 */
export const CalculatorView = {
  calcRes: document.getElementById('calc-res'),
  calcFps: document.getElementById('calc-fps'),
  calcDur: document.getElementById('calc-dur'),
  calcResVal: document.getElementById('calc-res-val'),
  calcFpsVal: document.getElementById('calc-fps-val'),
  calcDurVal: document.getElementById('calc-dur-val'),
  calcOutTime: document.getElementById('calc-out-time'),
  calcOutVram: document.getElementById('calc-out-vram'),
  calcOutGpu: document.getElementById('calc-out-gpu'),

  getInputs() {
    return {
      res: this.calcRes ? parseInt(this.calcRes.value, 10) : 2,
      fps: this.calcFps ? parseInt(this.calcFps.value, 10) : 2,
      dur: this.calcDur ? parseInt(this.calcDur.value, 10) : 5
    };
  },

  render(data) {
    if (this.calcResVal) this.calcResVal.textContent = data.resLabel;
    if (this.calcFpsVal) this.calcFpsVal.textContent = data.fpsLabel;
    if (this.calcDurVal) this.calcDurVal.textContent = data.durLabel;
    if (this.calcOutTime) this.calcOutTime.textContent = data.estSeconds;
    if (this.calcOutVram) this.calcOutVram.textContent = data.estVram;
    if (this.calcOutGpu) this.calcOutGpu.textContent = data.recGpu;
  }
};
