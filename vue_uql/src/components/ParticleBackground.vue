<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  type: 'quark' | 'electron' | 'nucleus' | 'gluon'
  orbitAngle: number
  orbitSpeed: number
  orbitRadius: number
  centerX: number
  centerY: number
  trail: { x: number; y: number; alpha: number }[]
  life: number
  maxLife: number
}

interface FissionEvent {
  x: number
  y: number
  progress: number
  particles: { angle: number; speed: number; color: string }[]
}

const particleList: Particle[] = []
const fissionEvents: FissionEvent[] = []
let mouseX = 0
let mouseY = 0
let width = 0
let height = 0

function createParticle(): Particle {
  const type = ['quark', 'electron', 'nucleus', 'gluon'][Math.floor(Math.random() * 4)] as Particle['type']
  const cx = Math.random() * width
  const cy = Math.random() * height

  const colors: Record<string, string[]> = {
    quark: ['#39ff14', '#2dd40f', '#45ff2a'],
    electron: ['#00e5ff', '#00b8d4', '#18ffff'],
    nucleus: ['#c6ff00', '#aeea00', '#eeff41'],
    gluon: ['#39ff14', '#00e5ff', '#c6ff00']
  }

  const colorSet = colors[type]
  const color = colorSet[Math.floor(Math.random() * colorSet.length)]

  return {
    x: cx,
    y: cy,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: type === 'nucleus' ? 2.5 + Math.random() * 2 : 0.8 + Math.random() * 1.5,
    color,
    alpha: 0.2 + Math.random() * 0.5,
    type,
    orbitAngle: Math.random() * Math.PI * 2,
    orbitSpeed: 0.002 + Math.random() * 0.008,
    orbitRadius: type === 'electron' ? 30 + Math.random() * 80 : 0,
    centerX: cx,
    centerY: cy,
    trail: [],
    life: 0,
    maxLife: 3000 + Math.random() * 5000
  }
}

function triggerFission(x: number, y: number) {
  const fragments: { angle: number; speed: number; color: string }[] = []
  const count = 6 + Math.floor(Math.random() * 6)
  for (let i = 0; i < count; i++) {
    fragments.push({
      angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3,
      speed: 1 + Math.random() * 3,
      color: ['#39ff14', '#00e5ff', '#c6ff00'][Math.floor(Math.random() * 3)]
    })
  }
  fissionEvents.push({ x, y, progress: 0, particles: fragments })
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  }
}

function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, width, height)

  // Draw subtle grid
  ctx.strokeStyle = 'rgba(57, 255, 20, 0.02)'
  ctx.lineWidth = 0.5
  const gridSize = 60
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw connections between nearby particles
  for (let i = 0; i < particleList.length; i++) {
    for (let j = i + 1; j < particleList.length; j++) {
      const dx = particleList[i].x - particleList[j].x
      const dy = particleList[i].y - particleList[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.08
        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(particleList[i].x, particleList[i].y)
        ctx.lineTo(particleList[j].x, particleList[j].y)
        ctx.stroke()
      }
    }
  }

  // Update and draw particles
  for (const p of particleList) {
    p.life++

    if (p.type === 'electron') {
      p.orbitAngle += p.orbitSpeed
      p.centerX += p.vx
      p.centerY += p.vy
      p.x = p.centerX + Math.cos(p.orbitAngle) * p.orbitRadius
      p.y = p.centerY + Math.sin(p.orbitAngle) * p.orbitRadius

      // Draw orbit trail
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha })
      if (p.trail.length > 15) p.trail.shift()

      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i]
        const a = (i / p.trail.length) * t.alpha * 0.3
        ctx.beginPath()
        ctx.arc(t.x, t.y, Math.max(0, p.radius * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 229, 255, ${a})`
        ctx.fill()
      }
    } else {
      p.x += p.vx
      p.y += p.vy
      p.centerX = p.x
      p.centerY = p.y
    }

    // Mouse interaction - gentle repulsion
    const mdx = p.x - mouseX
    const mdy = p.y - mouseY
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
    if (mdist < 150 && mdist > 0) {
      const force = (1 - mdist / 150) * 0.5
      p.vx += (mdx / mdist) * force
      p.vy += (mdy / mdist) * force
    }

    // Dampen velocity
    p.vx *= 0.99
    p.vy *= 0.99

    // Wrap around edges
    if (p.x < -50) { p.x = width + 50; p.centerX = p.x }
    if (p.x > width + 50) { p.x = -50; p.centerX = p.x }
    if (p.y < -50) { p.y = height + 50; p.centerY = p.y }
    if (p.y > height + 50) { p.y = -50; p.centerY = p.y }

    // Draw glow for nucleus
    if (p.type === 'nucleus') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0, p.radius * 4))
      gradient.addColorStop(0, `rgba(198, 255, 0, ${p.alpha * 0.4})`)
      gradient.addColorStop(1, 'rgba(198, 255, 0, 0)')
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(0, p.radius * 4), 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw particle
    const { r, g, b } = hexToRgb(p.color)
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(0, p.radius), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
    ctx.fill()

    // Randomly trigger fission
    if (p.type === 'nucleus' && Math.random() < 0.0003) {
      triggerFission(p.x, p.y)
    }
  }

  // Draw fission events
  for (let i = fissionEvents.length - 1; i >= 0; i--) {
    const event = fissionEvents[i]
    event.progress += 0.015

    // Draw core flash
    if (event.progress < 0.3) {
      const flashAlpha = (1 - event.progress / 0.3) * 0.6
      const flashRadius = Math.max(0, event.progress * 40)
      const gradient = ctx.createRadialGradient(event.x, event.y, 0, event.x, event.y, flashRadius)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`)
      gradient.addColorStop(0.3, `rgba(198, 255, 0, ${flashAlpha * 0.7})`)
      gradient.addColorStop(1, 'rgba(57, 255, 20, 0)')
      ctx.beginPath()
      ctx.arc(event.x, event.y, flashRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw ejected fragments
    for (const fragment of event.particles) {
      const dist = event.progress * fragment.speed * 50
      const px = event.x + Math.cos(fragment.angle) * dist
      const py = event.y + Math.sin(fragment.angle) * dist
      const alpha = Math.max(0, 1 - event.progress)
      const radius = Math.max(0, (1 - event.progress) * 2)
      const { r, g, b } = hexToRgb(fragment.color)

      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fill()
    }

    if (event.progress >= 1) {
      fissionEvents.splice(i, 1)
    }
  }
}

function animate(ctx: CanvasRenderingContext2D) {
  draw(ctx)
  animationId = requestAnimationFrame(() => animate(ctx))
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
}

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  handleResize()

  const count = Math.min(80, Math.floor((width * height) / 15000))
  for (let i = 0; i < count; i++) {
    particleList.push(createParticle())
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)

  animate(ctx)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  particleList.length = 0
  fissionEvents.length = 0
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>