// canvas.js
import { GradientEditor } from './gradient-editor.js';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myWindow");
  const ctx = canvas.getContext("2d");
  const simplex = new SimplexNoise();

  const width = canvas.width;
  const height = canvas.height;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const scale = 0.005;   // spatial resolution
  const zScale = 0.01;   // speed of animation through 3D space

  let frame = 0;

  // Initialize GradientEditor UI
  const gradientEditor = new GradientEditor("gradient-editor");

  function animatedNoise() {
    const z = frame * zScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        const nx = x * scale;
        const ny = y * scale;

        const value = simplex.noise3D(nx, ny, z);
        const normVal = (value + 1) / 2;

        const [r, g, b] = gradientEditor.getColorFromGradient(normVal);

        data[i]     = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    frame++;
    requestAnimationFrame(animatedNoise);
  }

  animatedNoise();
});
