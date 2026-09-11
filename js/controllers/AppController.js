/**
 * AppController.js
 * Master orchestrator connecting all sub-controllers, views, and models.
 */

import { BranchesModel } from '../models/BranchesModel.js';
import { PresetsModel } from '../models/PresetsModel.js';
import { HardwareSpecsModel } from '../models/HardwareSpecsModel.js';

import { StageView } from '../views/StageView.js';
import { ControllerView } from '../views/ControllerView.js';
import { SandboxView } from '../views/SandboxView.js';
import { CalculatorView } from '../views/CalculatorView.js';
import { ModalView } from '../views/ModalView.js';
import { NoticeView } from '../views/NoticeView.js';

import { PlayerController } from './PlayerController.js';
import { KeyboardController } from './KeyboardController.js';
import { SandboxController } from './SandboxController.js';
import { CalculatorController } from './CalculatorController.js';

export class AppController {
  constructor() {
    this.branchesModel = new BranchesModel();
    this.presetsModel = new PresetsModel();
    this.hardwareModel = new HardwareSpecsModel();

    this.stageView = new StageView();
    this.controllerView = new ControllerView();
    this.sandboxView = new SandboxView();
    this.calculatorView = new CalculatorView();
    this.modalView = new ModalView();
    this.noticeView = new NoticeView();

    this.playerController = new PlayerController(
      this.branchesModel,
      this.stageView,
      this.controllerView,
      this.noticeView
    );

    this.keyboardController = new KeyboardController(
      this.playerController,
      this.modalView
    );

    this.sandboxController = new SandboxController(
      this.presetsModel,
      this.sandboxView,
      this.modalView
    );

    this.calculatorController = new CalculatorController(
      this.hardwareModel,
      this.calculatorView
    );
  }

  init() {
    this.modalView.init();
    this.noticeView.init();
    this.playerController.init();
    this.keyboardController.init();
    this.sandboxController.init();
    this.calculatorController.init();

    this.bindGlobalNavigation();
    this.bindModals();
    this.bindLiveHUD();

    console.log('[AppController] LTX-2 World Model MVC Application Initialized.');
  }

  bindGlobalNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        mobileMenu.classList.toggle('is-open', !isExpanded);
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('is-open');
        });
      });
    }

    document.querySelectorAll('a[href^=#]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#' && !targetId.startsWith('#modal-')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  bindModals() {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetModalId = trigger.getAttribute('data-modal-target');
        if (targetModalId) {
          this.modalView.open(targetModalId);
        }
      });
    });
  }

  bindLiveHUD() {
    const hudBranch = document.getElementById('hud-active-branch');
    if (hudBranch) {
      this.playerController.onStateChange = (state) => {
        hudBranch.textContent = state.currentBranch.toUpperCase();
      };
    }
  }
}
