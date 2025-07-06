// === Create canvas for trail ===
const canvas = document.createElement('canvas');
canvas.id = 'trailCanvas';
Object.assign(canvas.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  pointerEvents: 'none',
  zIndex: '999'
});
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === Create UI container (bottom right) ===
const uiContainer = document.createElement('div');
uiContainer.id = 'trailUI';
Object.assign(uiContainer.style, {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  zIndex: '1000'
});
document.body.appendChild(uiContainer);

// === Status box ===
const statusBox = document.createElement('div');
statusBox.id = 'trailStatus';
statusBox.innerHTML = '👁️ <span style="color:darkgreen;">Mouse Animation is ON</span>';
Object.assign(statusBox.style, {
  background: 'rgba(255, 255, 255, 0.85)',
  color: '#111',
  padding: '12px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  boxShadow: '0 0 8px rgba(0,0,0,0.15)'
});
uiContainer.appendChild(statusBox);

// === Toggle button ===
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleTrail';
toggleButton.textContent = 'Click to turn OFF mouse animation';
Object.assign(toggleButton.style, {
  padding: '12px 16px',
  backgroundColor: '#222', // dark bg
  color: '#eee',           // light text on dark bg
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.3s, color 0.3s',
  boxShadow: '0 0 6px rgba(0,0,0,0.2)'
});
toggleButton.addEventListener('mouseover', () => {
  toggleButton.style.backgroundColor = '#111';
});
toggleButton.addEventListener('mouseout', () => {
  toggleButton.style.backgroundColor = trailEnabled ? '#222' : '#a2d149';
  toggleButton.style.color = trailEnabled ? '#eee' : '#222';
});
uiContainer.appendChild(toggleButton);

// === Particle Trail Logic ===
let particles = [];
let hue = 220; // start from blue hues, dark tones
let trailEnabled = true;

// Array of coding symbols & keywords for particles
const codeSymbols = ['{', '}', ';', '()', '[]', 'if', 'else', 'int', 'str', 'var', '==', '!=', '=>'];

let lastParticleTime = 0;
const particleInterval = 80; // ms between particles

toggleButton.addEventListener('click', () => {
  trailEnabled = !trailEnabled;

  statusBox.innerHTML = trailEnabled
    ? '👁️ <span style="color:darkgreen;">Mouse Animation is ON</span>'
    : '❌ <span style="color:#b22222;">Mouse Animation is OFF</span>';

  toggleButton.textContent = trailEnabled
    ? 'Click to turn OFF mouse animation'
    : 'Click to turn ON mouse animation';

  if (trailEnabled) {
    toggleButton.style.backgroundColor = '#222';
    toggleButton.style.color = '#eee';
  } else {
    toggleButton.style.backgroundColor = '#a2d149'; // dark lime for OFF
    toggleButton.style.color = '#222';
  }

  if (!trailEnabled) {
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

document.addEventListener('mousemove', e => {
  if (!trailEnabled) return;

  const now = Date.now();
  if (now - lastParticleTime < particleInterval) return;

  lastParticleTime = now;

  particles.push({
    x: e.clientX,
    y: e.clientY,
    alpha: 1,
    size: Math.random() * 20 + 28,
    hue: hue,
    symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
  });
  hue = (hue + 10) % 260 + 200; // keep hue in darker blue range (200–260)
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (trailEnabled) {
    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 30%, ${1 - dist / 150})`; // darker lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw symbols
    particles.forEach((p, i) => {
      ctx.fillStyle = `hsla(${p.hue}, 70%, 20%, ${p.alpha})`; // dark text
      ctx.shadowColor = `rgba(0, 0, 0, ${p.alpha * 0.9})`;    // stronger black shadow
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.font = `${p.size}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(p.symbol, p.x, p.y);

      p.x += (Math.random() - 0.5) * 0.7;
      p.y += (Math.random() - 0.5) * 0.7;
      p.alpha -= 0.015;

      if (p.alpha <= 0) particles.splice(i, 1);
    });
  }

  requestAnimationFrame(animate);
}
animate();

// Resize canvas if window resizes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
