import { GradientEditor } from './gradient-editor.js';

let editor;

window.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize the gradient editor
  const editor = new GradientEditor("gradient-editor");

  // 2. Generate shareable link button
  const shareBtn = document.getElementById('generate-link');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const gradient = editor.getGradientConfig();
      const encoded = btoa(JSON.stringify(gradient));
      const shareURL = `${window.location.origin}${window.location.pathname}#${encoded}`;
      prompt("Share this link:", shareURL);
    });
  }

  // 3. Load gradient from URL hash (if present)
  if (location.hash.length > 1) {
    try {
      const decoded = atob(location.hash.slice(1));
      const config = JSON.parse(decoded);
      editor.setGradientConfig(config);
    } catch (e) {
      console.error("Invalid gradient config in URL:", e);
    }
  }
});
