/**
 * ControllerView.js
 * Encapsulates the glass controller bar, track, sliding capsule, cells, and Reset transformations.
 */
export const ControllerView = {
  controller: document.getElementById('controller'),
  track: document.getElementById('track'),
  capsule: document.getElementById('capsule'),
  cells: document.getElementById('cells'),
  buttons: [],
  labelCell: null,
  allCells: [],

  init() {
    if (!this.cells) return;
    this.buttons = Array.prototype.slice.call(this.cells.querySelectorAll('button[data-branch]'));
    this.labelCell = this.cells.querySelector('.label-cell');
    this.allCells = Array.prototype.slice.call(this.cells.children);
  },

  setCapsulePosition(positionObj) {
    if (!this.controller || !positionObj) return;
    this.controller.style.setProperty('--cap-left', positionObj.left);
    this.controller.style.setProperty('--cap-width', positionObj.width);
  },

  setGlassCoordinates(xPercent, yPercent) {
    if (!this.controller) return;
    this.controller.style.setProperty('--glass-x', xPercent.toFixed(2) + '%');
    this.controller.style.setProperty('--glass-y', yPercent.toFixed(2) + '%');
  },

  setHover(isHovered) {
    if (!this.controller) return;
    if (isHovered) {
      this.controller.classList.add('has-hover');
    } else {
      this.controller.classList.remove('has-hover');
    }
  },

  setButtonsDisabled(disabled) {
    this.buttons.forEach(btn => {
      btn.disabled = disabled;
    });
  },

  collapseController(chosenButton) {
    if (!this.controller) return;
    this.controller.classList.add('collapsed');
    this.controller.classList.remove('has-hover');

    this.allCells.forEach(cell => {
      if (cell !== chosenButton) {
        cell.classList.add('fade-out');
        cell.setAttribute('aria-hidden', 'true');
      }
    });
    this.updateTranslation(chosenButton);
  },

  expandController(originatingButton, originalName) {
    if (!this.controller) return;
    this.controller.classList.remove('collapsed');

    if (originatingButton) {
      originatingButton.classList.remove('is-reset');
      originatingButton.style.transform = '';
      originatingButton.textContent = originalName;
      originatingButton.removeAttribute('aria-label');
    }

    this.allCells.forEach(cell => {
      cell.classList.remove('fade-out');
      cell.removeAttribute('aria-hidden');
    });

    this.buttons.forEach(btn => {
      btn.removeAttribute('aria-hidden');
      btn.removeAttribute('tabindex');
    });
  },

  transformToReset(button) {
    if (!button) return;
    button.textContent = 'Reset';
    button.classList.add('is-reset');
    button.disabled = false;
    button.setAttribute('aria-label', 'Reset to base view');

    this.buttons.forEach(b => {
      if (b !== button) {
        b.disabled = true;
        b.setAttribute('aria-hidden', 'true');
        b.setAttribute('tabindex', '-1');
      }
    });
  },

  updateTranslation(activeButton) {
    if (!activeButton || !this.controller || !this.controller.classList.contains('collapsed')) return;

    var controllerRect = this.controller.getBoundingClientRect();
    var targetCenterX = controllerRect.left + (controllerRect.width / 2);
    var targetCenterY = controllerRect.top + (controllerRect.height / 2);

    activeButton.style.transform = '';
    var btnRect = activeButton.getBoundingClientRect();
    var btnCenterX = btnRect.left + (btnRect.width / 2);
    var btnCenterY = btnRect.top + (btnRect.height / 2);

    var dx = targetCenterX - btnCenterX;
    var dy = targetCenterY - btnCenterY;
    activeButton.style.transform = 'translate(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px)';
  }
};
