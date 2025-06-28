// gradient-editor.js

export class GradientEditor {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.bar = this.container.querySelector("#gradient-bar");
    this.colorPicker = this.container.querySelector("#color-picker");

    this.gradient = [
      { stop: 0.0, color: [0, 0, 128] },
      { stop: 1.0, color: [255, 255, 255] }
    ];

    this.setupUI();
    this.updateGradientPreview();
  }

  setupUI() {
    this.bar.addEventListener("dblclick", (e) => {
      const rect = this.bar.getBoundingClientRect();
      const stop = (e.clientX - rect.left) / rect.width;
      this.gradient.push({ stop, color: [255, 255, 255] });
      this.updateGradientPreview();
    });
  }

  updateGradientPreview() {
    this.gradient.sort((a, b) => a.stop - b.stop);
    const gradientStr = this.gradient
      .map(stop => `rgb(${stop.color.join(',')}) ${stop.stop * 100}%`)
      .join(', ');
    this.bar.style.background = `linear-gradient(to right, ${gradientStr})`;
    this.renderStops();
  }

  renderStops() {
    this.bar.querySelectorAll('.gradient-stop').forEach(el => el.remove());

    this.gradient.forEach((stop, index) => {
      const marker = document.createElement('div');
      marker.className = 'gradient-stop';
      marker.style.left = `${stop.stop * 100}%`;
      marker.style.background = `rgb(${stop.color.join(',')})`;
      marker.dataset.index = index;

      marker.addEventListener('mousedown', (e) => {
        const onMove = (eMove) => {
          const rect = this.bar.getBoundingClientRect();
          let percent = (eMove.clientX - rect.left) / rect.width;
          percent = Math.min(1, Math.max(0, percent));
          this.gradient[index].stop = percent;
          this.updateGradientPreview();
        };

        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      marker.addEventListener('click', () => {
        this.colorPicker.value = this.rgbToHex(...stop.color);
        this.colorPicker.style.display = 'block';
        this.colorPicker.oninput = (e) => {
          this.gradient[index].color = this.hexToRgb(e.target.value);
          this.updateGradientPreview();
        };
      });

      this.bar.appendChild(marker);
    });
  }

  rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  hexToRgb(hex) {
    const val = parseInt(hex.slice(1), 16);
    return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
  }

  getColorFromGradient(value) {
    value = Math.min(Math.max(value, 0), 1);
    this.gradient.sort((a, b) => a.stop - b.stop);
    for (let i = 0; i < this.gradient.length - 1; i++) {
      const left = this.gradient[i];
      const right = this.gradient[i + 1];
      if (value >= left.stop && value <= right.stop) {
        const t = (value - left.stop) / (right.stop - left.stop);
        const r = left.color[0] + t * (right.color[0] - left.color[0]);
        const g = left.color[1] + t * (right.color[1] - left.color[1]);
        const b = left.color[2] + t * (right.color[2] - left.color[2]);
        return [r, g, b];
      }
    }
    return value < this.gradient[0].stop
      ? this.gradient[0].color
      : this.gradient[this.gradient.length - 1].color;
  }
}
