/**
 * PresetsModel.js
 * Manages prompt presets, generation parameters, code generation, and ComfyUI workflow export schemas.
 */
export const PresetsModel = {
  presets: {
    fashion: {
      prompt: "A centered model in luxury silk attire walking through brutalist architectural arches, high fashion dynamic lighting, photorealistic 8K render, physical cloth motion.",
      dolly: 1.2,
      motion: 0.85
    },
    cyberpunk: {
      prompt: "Neo-Tokyo rain reflection on wet asphalt, holographic neon signage casting volumetric pink and cyan specular highlights across a cinematic character silhouette.",
      dolly: 0.8,
      motion: 1.15
    },
    desert: {
      prompt: "Sweeping golden hour desert dunes, physical wind turbulence drifting fine sand particles across architectural concrete structures.",
      dolly: 1.5,
      motion: 0.60
    },
    space: {
      prompt: "Zero-gravity orbital habitat hydroponics bay, slow panoramic camera tilt tracking water droplet surface tension dynamics and earth horizon in background.",
      dolly: -0.5,
      motion: 0.90
    }
  },

  getPreset(key) {
    return this.presets[key] || this.presets.fashion;
  },

  generateCode(lang, prompt, dolly, motion) {
    var p = prompt || '';
    var d = dolly || 1.2;
    var m = motion || 0.85;

    if (lang === 'python') {
      return '<span class="code-token-kw">import</span> ltx_video\n\n' +
        'client = ltx_video.<span class="code-token-fn">Client</span>(api_key=<span class="code-token-str">"YOUR_API_KEY"</span>)\n\n' +
        'response = client.world_model.<span class="code-token-fn">generate</span>(\n' +
        '    model=<span class="code-token-str">"ltx-2.5-dit"</span>,\n' +
        '    prompt=<span class="code-token-str">"' + p.replace(/"/g, '\\"') + '"</span>,\n' +
        '    camera_dolly=<span class="code-token-num">' + d + '</span>,\n' +
        '    motion_dynamics=<span class="code-token-num">' + m + '</span>,\n' +
        '    resolution=<span class="code-token-str">"1920x1080"</span>,\n' +
        '    fps=<span class="code-token-num">30</span>,\n' +
        '    duration_sec=<span class="code-token-num">5.0</span>\n' +
        ')\n\n' +
        '<span class="code-token-fn">print</span>(<span class="code-token-str">f"Video URL: {response.video_url}"</span>)';
    } else if (lang === 'curl') {
      return 'curl -X POST https://api.ltx.io/v1/world/generate \\\n' +
        '  -H <span class="code-token-str">"Authorization: Bearer YOUR_API_KEY"</span> \\\n' +
        '  -H <span class="code-token-str">"Content-Type: application/json"</span> \\\n' +
        '  -d \'{\n' +
        '    <span class="code-token-str">"model"</span>: <span class="code-token-str">"ltx-2.5-dit"</span>,\n' +
        '    <span class="code-token-str">"prompt"</span>: <span class="code-token-str">"' + p.replace(/'/g, "\\'") + '"</span>,\n' +
        '    <span class="code-token-str">"camera_dolly"</span>: <span class="code-token-num">' + d + '</span>,\n' +
        '    <span class="code-token-str">"motion_dynamics"</span>: <span class="code-token-num">' + m + '</span>\n' +
        '  }\'';
    } else if (lang === 'ts') {
      return '<span class="code-token-kw">import</span> { LTXClient } <span class="code-token-kw">from</span> <span class="code-token-str">"@lightricks/ltx-sdk"</span>;\n\n' +
        '<span class="code-token-kw">const</span> ltx = <span class="code-token-kw">new</span> <span class="code-token-fn">LTXClient</span>({ apiKey: process.env.LTX_API_KEY });\n\n' +
        '<span class="code-token-kw">const</span> video = <span class="code-token-kw">await</span> ltx.world.<span class="code-token-fn">generate</span>({\n' +
        '  model: <span class="code-token-str">"ltx-2.5-dit"</span>,\n' +
        '  prompt: <span class="code-token-str">"' + p.replace(/"/g, '\\"') + '"</span>,\n' +
        '  cameraDolly: <span class="code-token-num">' + d + '</span>,\n' +
        '  motionDynamics: <span class="code-token-num">' + m + '</span>,\n' +
        '});\n\n' +
        'console.<span class="code-token-fn">log</span>(video.playbackUrl);';
    }
    return '';
  },

  createComfyUIWorkflow(prompt) {
    return {
      version: "1.0",
      generator: "LTX-2.5-Studio-Exporter",
      nodes: [
        {
          id: 1,
          type: "LTX_ModelLoader",
          widgets_values: ["ltx-2.5-dit.safetensors", "bf16"]
        },
        {
          id: 2,
          type: "CLIPTextEncode",
          widgets_values: [prompt || "Cinematic world model"]
        },
        {
          id: 3,
          type: "LTX_SpatialTrajectorySampler",
          widgets_values: [30, 7.5, "euler", "normal", 1.0]
        },
        {
          id: 4,
          type: "LTX_VideoDecoder",
          widgets_values: ["1920x1080", 30]
        }
      ]
    };
  }
};
