const canvas = document.getElementById("wave-bg");
const ctx = canvas.getContext("2d");

let width, height, time = 0;

const mouse = {
  x: 0,
  y: 0,
  radius: 180,
  active: false,
  smoothX: 0,
  smoothY: 0,
};

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

function smoothSignalNoise(x) {
  return (
    Math.sin(x * 0.012 + time * 0.03) * 0.6 +
    Math.sin(x * 0.025 + time * 0.02) * 0.3 +
    Math.sin(x * 0.05 + time * 0.015) * 0.1
  );
}

function audioWave(x) {
  const base =
    Math.sin(x * 0.015 + time * 0.04) * 18 +
    Math.sin(x * 0.03 + time * 0.06) * 8 +
    Math.sin(x * 0.06 + time * 0.08) * 4;

  return base + smoothSignalNoise(x) * 4;
}

function drawWave({ color, lineWidth, gain, alpha }) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;

  const baseY = height * (3 / 4);

  mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
  mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

  for (let x = 0; x < width; x += 2) {
    let y = baseY + audioWave(x) * gain;

    if (mouse.active) {
      const dx = x - mouse.smoothX;
      const dy = y - mouse.smoothY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const influence = 1 - dist / mouse.radius;
        const smoothInfluence = influence * influence;

        y += smoothInfluence * 55;
      }
    }

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  // white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const wine = "#6B1E3A";

  drawWave({
    color: wine,
    lineWidth: 2,
    gain: 1.1,
    alpha: 0.9,
  });

  drawWave({
    color: wine,
    lineWidth: 4,
    gain: 2.0,
    alpha: 0.18,
  });

  drawWave({
    color: wine,
    lineWidth: 6,
    gain: 2.8,
    alpha: 0.08,
  });

  time += 1;
  requestAnimationFrame(animate);
}

animate();