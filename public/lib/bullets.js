import { integrate, moveAngle } from './bodies.js'

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
    lifetime: time + 1500,
    drag: 0,
    r: 12,
  }
  moveAngle(b, 7, angle)
  state.bullets.push(b)
}

export function destroyBullet(b) {
  b.lifetime = 0
}