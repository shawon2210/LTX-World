/**
 * AppController.js - Master orchestrator wiring all MVC layers.
 */
import { BranchesModel }       from "../models/BranchesModel.js";
import { PresetsModel }         from "../models/PresetsModel.js";
import { HardwareSpecsModel }   from "../models/HardwareSpecsModel.js";
import { StageView }            from "../views/StageView.js";
import { ControllerView }       from "../views/ControllerView.js";
import { SandboxView }          from "../views/SandboxView.js";
import { CalculatorView }       from "../views/CalculatorView.js";
import { ModalView }            from "../views/ModalView.js";
import { NoticeView }           from "../views/NoticeView.js";
import { PlayerController }     from "./PlayerController.js";
import { KeyboardController }   from "./KeyboardController.js";
import { SandboxController }    from "./SandboxController.js";
import { CalculatorController } from "./CalculatorController.js";

export class AppController {
  constructor() {
    this.branchesModel  = new BranchesModel();
    this.presetsModel   = new PresetsModel();
    this.hardwareModel  = new HardwareSpecsModel();
    this.stageView      = new StageView();
    this.controllerView = new ControllerView();
    this.sandboxView    = new SandboxView();
    this.calculatorView = new CalculatorView();
    this.modalView      = new ModalView();
    this.noticeView     = new NoticeView();
    this.player     = new PlayerController(this.branchesModel, this.stageView, this.controllerView, this.noticeView);
    this.keyboard   = new KeyboardController(this.player, this.modalView);
    this.sandbox    = new SandboxController(this.presetsModel, this.sandboxView, this.modalView);
    this.calculator = new CalculatorController(this.hardwareModel, this.calculatorView);
  }

  init() {
    this.noticeView.init();
    this.modalView.init();
    this.player.init();
    this.keyboard.init();
    this.sandbox.init();
    this.calculator.init();
    this._bindNavigation();
    this._bindModals();
    console.log("[LTX MVC] Application initialised.");
  }

  _bindNavigation() {
    var toggle = document.getElementById("menu-toggle");
    var menu   = document.getElementById("mobile-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function() {
        var exp = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!exp));
        menu.classList.toggle("is-open", !exp);
      });
      menu.querySelectorAll("a").forEach(function(lnk) {
        lnk.addEventListener("click", function() {
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.remove("is-open");
        });
      });
    }
    document.querySelectorAll("a[href^=\"#\"]").forEach(function(a) {
      a.addEventListener("click", function(e) {
        var id = a.getAttribute("href");
        if (id && id.length > 1) {
          var el = document.querySelector(id);
          if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
        }
      });
    });
  }

  _bindModals() {
    var self = this;
    document.querySelectorAll("[data-modal-target]").forEach(function(t) {
      t.addEventListener("click", function(e) {
        e.preventDefault();
        var id = t.getAttribute("data-modal-target");
        if (id) self.modalView.open(id);
      });
    });
  }
}
