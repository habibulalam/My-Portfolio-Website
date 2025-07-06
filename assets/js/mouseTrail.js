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
statusBox.innerHTML = '👁️ <span style="color:limegreen;">Mouse Animation is ON</span>';
Object.assign(statusBox.style, {
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  userSelect: 'none'
});
uiContainer.appendChild(statusBox);

// === Toggle button ===
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleTrail';
toggleButton.textContent = 'Click to turn OFF mouse animation';
Object.assign(toggleButton.style, {
  padding: '12px 16px',
  backgroundColor: '#d11453', // ON state bg
  color: '#ffffff',           // ON state text color
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.3s, color 0.3s'
});
toggleButton.addEventListener('mouseover', () => toggleButton.style.backgroundColor = '#b01245');
toggleButton.addEventListener('mouseout', () => {
  toggleButton.style.backgroundColor = trailEnabled ? '#d11453' : 'limegreen';
  toggleButton.style.color = trailEnabled ? '#ffffff' : '#000000';
});
uiContainer.appendChild(toggleButton);

// === Particle Trail Logic ===
let particles = [];
let hue = 0;
let trailEnabled = true;

toggleButton.addEventListener('click', () => {
  trailEnabled = !trailEnabled;

  // Update status text and color
  statusBox.innerHTML = trailEnabled
    ? '👁️ <span style="color:limegreen;">Mouse Animation is ON</span>'
    : '❌ <span style="color:red;">Mouse Animation is OFF</span>';

  // Update toggle button text and style
  toggleButton.textContent = trailEnabled
    ? 'Click to turn OFF mouse animation'
    : 'Click to turn ON mouse animation';

  if (trailEnabled) {
    toggleButton.style.backgroundColor = '#d11453';
    toggleButton.style.color = '#ffffff';
  } else {
    toggleButton.style.backgroundColor = 'limegreen';
    toggleButton.style.color = '#000000';
  }

  if (!trailEnabled) {
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

document.addEventListener('mousemove', e => {
  if (!trailEnabled) return;
  particles.push({
    x: e.clientX,
    y: e.clientY,
    alpha: 1,
    size: Math.random() * 8 + 4,
    hue: hue
  });
  hue = (hue + 5) % 360;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (trailEnabled) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.strokeStyle = `hsla(${particles[i].hue}, 100%, 70%, ${1 - dist / 100})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p, i) => {
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += (Math.random() - 0.5) * 1.5;
      p.y += (Math.random() - 0.5) * 1.5;
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
