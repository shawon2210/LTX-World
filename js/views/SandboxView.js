/**
 * SandboxView.js
 * Encapsulates the prompt playground, camera sliders, code viewer tabs, and copy/export actions.
 */
export const SandboxView = {
  promptInput: document.getElementById('sandbox-prompt'),
  sliderDolly: document.getElementById('slider-dolly'),
  sliderMotion: document.getElementById('slider-motion'),
  valDolly: document.getElementById('val-dolly'),
  valMotion: document.getElementById('val-motion'),
  codeOutput: document.getElementById('code-output'),
  presetChips: document.querySelectorAll('.chip[data-preset]'),
  codeTabs: document.querySelectorAll('.code-tab[data-lang]'),
  btnCopy: document.getElementById('btn-copy-code'),
  btnExportComfy: document.getElementById('btn-export-comfy'),

  getPrompt() {
    return this.promptInput ? this.promptInput.value : '';
  },

  setPrompt(val) {
    if (this.promptInput) this.promptInput.value = val;
  },

  getDolly() {
    return this.sliderDolly ? parseFloat(this.sliderDolly.value) : 1.2;
  },

  setDolly(val) {
    if (this.sliderDolly) this.sliderDolly.value = val;
    if (this.valDolly) this.valDolly.textContent = (val > 0 ? '+' : '') + val + 'x';
  },

  getMotion() {
    return this.sliderMotion ? parseFloat(this.sliderMotion.value) : 0.85;
  },

  setMotion(val) {
    if (this.sliderMotion) this.sliderMotion.value = val;
    if (this.valMotion) this.valMotion.textContent = val;
  },

  setCode(htmlCode) {
    if (this.codeOutput) this.codeOutput.innerHTML = htmlCode;
  },

  setActiveTab(selectedTab) {
    this.codeTabs.forEach(t => t.classList.remove('active'));
    if (selectedTab) selectedTab.classList.add('active');
  },

  setActivePreset(selectedChip) {
    this.presetChips.forEach(c => c.classList.remove('active'));
    if (selectedChip) selectedChip.classList.add('active');
  }
};
