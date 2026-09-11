/**
 * CalculatorController.js
 * Controls the VRAM & Latency Estimator: reacts to hardware changes,
 * resolution, frame count, precision, and updates the calculator view metrics.
 */

export class CalculatorController {
  /**
   * @param {import('../models/HardwareSpecsModel.js').HardwareSpecsModel} hardwareModel 
   * @param {import('../views/CalculatorView.js').CalculatorView} calculatorView 
   */
  constructor(hardwareModel, calculatorView) {
    this.model = hardwareModel;
    this.view = calculatorView;
  }

  init() {
    this.view.init();

    this.view.onSpecsChange(() => {
      this.recalculate();
    });

    this.recalculate();
  }

  recalculate() {
    const inputValues = this.view.getInputValues();
    const estimates = this.model.calculate(inputValues);
    this.view.renderEstimates(estimates);
  }
}
