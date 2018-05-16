import { integrate, moveAngle } from './bodies.mjs'

export function particles(state, action) {
  if (!state.particles) state.particles = []
  if (action.name === 'tick') {
    state.particles = state.particles.filter(s => s.r > 3)
    state.particles.forEach(s => {
      integrate(s)
      s.r *= 0.99
    })
  }
}

export function createParticle(state, x, y, r, type, props) {
  if (!state.particles) state.particles = []
  const particle = Object.assign({
    x, y, r, type,
    x1: x, y1: y,
    drag: 0.05,
  }, props)
  state.particles.push(particle)
  return particle
}

export function createSmoke(state, x, y, r) {
  const p = createParticle(state, x, y, r, 'smoke')
  moveAngle(p, Math.random(), Math.random() * Math.PI * 2)
}

export function createSpark(state, x, y, r, angle) {
  const p = createParticle(state, x, y, r, 'spark')
  moveAngle(p, 2 + Math.random() * 8, angle + (Math.random() - 0.5) * Math.PI)
}