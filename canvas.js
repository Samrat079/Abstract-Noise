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

  function hsvToRgb(h, s, v) {
    let f = (n, k = (n + h * 6) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5) * 255, f(3) * 255, f(1) * 255];
  }


  function animatedNoise() {
    const z = frame * zScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        const nx = x * scale;
        const ny = y * scale;

        const value = simplex.noise3D(nx, ny, z);
        const normVal = (value + 1) / 2;

        const [r, g, b] = hsvToRgb(normVal, 1, 1); 

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
