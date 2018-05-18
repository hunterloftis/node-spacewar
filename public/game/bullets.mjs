import { integrate, moveAngle } from './bodies.mjs'
import { createSpark } from './particles.mjs'

const LIFETIME = 2000

export function bullets(state, action) {
  if (!state.bullets) state.bullets = []
  if (action.name === 'tick') {
    state.bullets = state.bullets.filter(b => state.time <= b.lifetime)
    state.bullets.forEach(bullet => {
      integrate(bullet)
    })
  }
}

export function createBullet(state, x, y, angle, time) {
  if (!state.bullets) state.bullets = []
  const b = {
    x, y, angle,
    x1: x, y1: y,
    lifetime: time + LIFETIME,
    drag: 0,
    r: 12,
  }
  moveAngle(b, 7, angle)
  state.bullets.push(b)
}

export function destroyBullet(state, b) {
  b.lifetime = 0
  for (let i = 0; i < 7; i++) {
    createSpark(state, b.x, b.y, b.r * 0.33, b.angle + Math.PI)
  }
}