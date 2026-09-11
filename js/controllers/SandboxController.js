/**
 * SandboxController.js
 * Controls the interactive studio sandbox: prompt presets, parameter sliders,
 * live code generation (Python/cURL/ComfyUI/CLI), clipboard copying, and workflow exporting.
 */

export class SandboxController {
  /**
   * @param {import('../models/PresetsModel.js').PresetsModel} presetsModel 
   * @param {import('../views/SandboxView.js').SandboxView} sandboxView 
   * @param {import('../views/ModalView.js').ModalView} modalView 
   */
  constructor(presetsModel, sandboxView, modalView) {
    this.model = presetsModel;
    this.view = sandboxView;
    this.modalView = modalView;
    this.currentLang = 'python';
  }

  init() {
    this.view.init();

    // Preset chip clicks
    this.view.onPresetClick((presetKey) => {
      const preset = this.model.getPreset(presetKey);
      if (preset) {
        this.view.setPrompt(preset.prompt);
        this.updateCode();
      }
    });

    // Language tabs
    this.view.onLanguageTabClick((lang) => {
      this.currentLang = lang;
      this.view.setActiveLanguageTab(lang);
      this.updateCode();
    });

    // Parameter sliders & prompt input
    this.view.onParamsChange(() => {
      this.updateCode();
    });

    // Copy Code button
    this.view.onCopyCode(() => {
      const params = this.view.getParams();
      const code = this.model.generateSnippet(this.currentLang, params);
      navigator.clipboard.writeText(code).then(() => {
        this.modalView.showToast('Code snippet copied to clipboard!');
      }).catch(() => {
        this.modalView.showToast('Failed to copy to clipboard', 'error');
      });
    });

    // Export ComfyUI JSON button
    this.view.onExportWorkflow(() => {
      const params = this.view.getParams();
      const workflowObj = this.model.generateComfyWorkflow(params);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(workflowObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'ltx_world_workflow.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.modalView.showToast('ComfyUI workflow exported successfully!');
    });

    // Initial code generation
    this.updateCode();
  }

  updateCode() {
    const params = this.view.getParams();
    const snippet = this.model.generateSnippet(this.currentLang, params);
    this.view.renderCodeSnippet(snippet, this.currentLang);
  }
}
