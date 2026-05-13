const canvas = document.getElementById("wave-bg");
const ctx = canvas.getContext("2d");

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

let width, height;
let waves = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  createWaves();
}

window.addEventListener("resize", resizeCanvas);

function createWaves() {
  waves = [];

  const waveCount = isMobile ? 3 : 5;

  for (let i = 0; i < waveCount; i++) {
    waves.push({
      y: height * (0.2 + i * 0.15),
      length: 0.003 + Math.random() * 0.002,
      amplitude: 30 + Math.random() * 40,
      speed: 0.5 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2,
      opacity: 0.16 + Math.random() * 0.12,
      thickness: 1 + Math.random() * 2,
    });
  }
}

let mouse = {
  x: width / 2,
  y: height / 2,
};

window.addEventListener("mousemove", (e) => {
  if (!isMobile) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
});

function drawWave(wave, time) {
  ctx.beginPath();

  for (let x = 0; x <= width; x += 8) {
    const y =
      wave.y +
      Math.sin(x * wave.length + time * wave.speed + wave.offset) *
        wave.amplitude;

    const mouseInfluence = !isMobile
      ? Math.sin((x - mouse.x) * 0.01) * 10
      : 0;

    ctx.lineTo(x, y + mouseInfluence);
  }

  ctx.strokeStyle = `rgba(52, 23, 37, ${wave.opacity})`;
  ctx.lineWidth = wave.thickness;
  ctx.stroke();
}

function animate(time) {
  ctx.clearRect(0, 0, width, height);

  waves.forEach((wave) => drawWave(wave, time * 0.001));

  requestAnimationFrame(animate);
}

resizeCanvas();
animate();