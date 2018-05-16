import { damageAsteroid } from './asteroids.mjs'
import { destroyBullet } from './bullets.mjs'
import { damageShip } from './ships.mjs'

export function collisions(state, action) {
  if (action.name === 'tick') {
    state.ships.forEach(s => {
      s.hurting = false
      if (s.health <= 0) return
      state.asteroids.forEach(a => {
        if (hits(a, s)) {
          damageShip(s, 1, state.time)
        }
      })
      state.bullets.forEach(b => {
        if (hits(b, s)) {
          damageShip(s, 10, state.time)
          destroyBullet(state, b)
        }
      })
    })
    state.bullets.forEach(b => {
      state.asteroids.forEach(a => {
        if (hits(b, a)) {
          damageAsteroid(a, 10, state.time)
          destroyBullet(state, b)
        }
      })
    })
  }
}

export function hits(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const d = Math.sqrt(dx * dx + dy * dy)
  return d < a.r + b.r
}
