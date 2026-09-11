/**
 * app.js
 * Bootstrap entry point for LTX-2 World Model MVC architecture.
 */

import { AppController } from './controllers/AppController.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
  window.__LTX_APP__ = app;
});
