# LTX — The World Model

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel&style=flat-square)](https://ltx-world-model.vercel.app)

> Open world modeling intelligence for real-time video synthesis, spatial physics understanding, and generative media production.

LTX builds open world models that give you full control — from production-grade video to systems that understand and operate in the physical world. This repository is the interactive product site for **LTX-2.5**, a 5B spatial diffusion model, featuring a live cinematic state switcher and a developer studio & API composer.

**Live demo:** [https://ltx-world-model.vercel.app](https://ltx-world-model.vercel.app)

---

## Overview

The site is a self-contained, single-page experience that demonstrates world-model intelligence through an interactive "branch" video switcher. Visitors can flip between **Scene**, **Lighting**, **Clothing**, and **Cast** states of a cinematic sequence in real time — watching the model re-synthesize geometry, light, materials, and characters on the fly.

It also ships as a working prototype of the product's developer surface: a sandboxed **API Composer** with code snippets, hardware-spec calculators, and benchmark comparisons against leading video models.

## Features

- **Interactive world-state switcher** — Scene / Lighting / Clothing / Cast branches with per-branch forward + reverse playback and a spring-animated capsule controller.
- **Keyboard navigation** — Full hotkey control of the switcher (no mouse required); a shortcuts cheatsheet modal is built in.
- **Developer Studio & API Composer** — Interactive request-builder sandbox with copy-to-clipboard controls.
- **Architecture & specs modals** — LTX-2.5 DiT details, developer API quickstart, and hardware requirements.
- **Benchmark comparisons** — Feature and hardware-spec tables positioning LTX against other world models.
- **Fully responsive** — Tablet, mobile, and compact breakpoints in `css/responsive.css`, plus `prefers-reduced-motion` support.
- **Accessible** — Semantic landmarks, `role="status"` live regions, focus-visible outlines, and `aria-hidden` fallbacks.

## Tech Stack

| Layer   | Technology                                  |
| ------- | ------------------------------------------- |
| Markup  | Semantic HTML5 (single page, no build step) |
| Styles  | Pure CSS with custom properties & glass     |
| Scripts | Vanilla ES Modules (MVC architecture)       |
| Hosting | Vercel (static, zero-config)                |

## Project Structure

```
├── index.html                 # Single-page application shell + inline styles & scripts
├── css/
│   ├── main.css               # Base layout & hero
│   ├── stage.css              # Stage / video presentation
│   ├── controller.css         # Branch switcher controller
│   ├── components.css         # Cards, buttons, modals, badges
│   ├── glass.css              # Glass-morphism primitives
│   └── responsive.css         # Breakpoints & reduced-motion
├── js/
│   ├── app.js                 # Bootstrap entry point
│   ├── controllers/           # App, keyboard, player, calculator, sandbox
│   ├── models/                # Branches, presets, hardware specs
│   └── views/                 # Stage, controller, calculator, modal, notice, sandbox
├── vercel.json                # Static deployment config
└── write_app.py               # Generation helper (not part of the runtime site)
```

## Getting Started

The app is pure static HTML/CSS/JS — no install or build step required.

```bash
# serve locally with any static file server
npx serve .
# or with python
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Deploying to Vercel

The repository ships with a zero-config `vercel.json` (static output, clean URLs).

```bash
# from the repository root
vercel --prod
```

Or connect the repository through the [Vercel Dashboard](https://vercel.com/new) — the framework preset is **Other** / static.

## Keyboard Shortcuts

| Key        | Action                                |
| ---------- | ------------------------------------- |
| `1`        | Switch to Scene branch                |
| `2`        | Switch to Lighting branch             |
| `3`        | Switch to Clothing branch             |
| `4`        | Switch to Cast branch                 |
| `Space` / `R` | Reset to base scene (when selected) |
| `?`        | Toggle the shortcuts cheatsheet       |

## License

All model and product logos, brand assets, and references to LTX are property of their respective owners. Code in this repository is provided for demonstration purposes.