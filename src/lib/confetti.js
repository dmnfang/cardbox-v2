export function spawnConfetti(colors, count = 60) {
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden;'
  document.body.appendChild(container)

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    p.className = 'confetti-piece'
    p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 40}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.4}s;animation-duration:${0.8 + Math.random() * 0.8}s`
    container.appendChild(p)
  }

  setTimeout(() => container.remove(), 2000)
}