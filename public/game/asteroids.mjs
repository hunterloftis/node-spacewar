import { integrate, moveAngle } from './bodies.mjs'
import { createParticle } from './particles.mjs'
import semiRandom from './semi-random.mjs'

const ASTEROID_COUNT = 7

export function asteroids(state, action, host) {
  const rand1 = semiRandom(state.time)
  const rand2 = semiRandom(state.time * 1.5)
  const rand3 = semiRandom(state.time + 25)
  if (!state.asteroids) state.asteroids = []
  state.lasteroid = state.lasteroid || 0
  if (action.name === 'tick') {
    state.asteroids = state.asteroids.filter(a => {
      const lim = state.limit + a.r * 4
      if (Math.abs(a.x) > lim || Math.abs(a.y) > lim) return false
      return a.health > 0
    })
    state.asteroids.forEach(asteroid => {
      integrate(asteroid)
    })
    if (host && state.asteroids.length < ASTEROID_COUNT && state.lasteroid < state.time - 500) {
      const r = 15 + rand1 * 30
      const l = state.limit + r * 3
      let x, y
      if (rand2 > 0.5) {
        x = rand3 > 0.5 ? l : -l
        y = (rand1 - 0.5) * state.limit
      } else {
        x = (rand2 - 0.5) * state.limit
        y = rand3 > 0.5 ? l : -l
      }
      const tx = (rand1 - 0.5) * state.limit
      const ty = (rand2 - 0.5) * state.limit
      const dx = tx - x
      const dy = ty - y
      const angle = Math.atan2(dy, dx)
      const asteroid = {
        x, y, r,
        x1: x, y1: y,
        drag: 0,
        health: Math.ceil(30 * r / 45)
      }
      moveAngle(asteroid, 1, angle)
      state.asteroids.push(asteroid)
      state.lasteroid = state.time
    }
  }
}

export function damageAsteroid(state, asteroid, n) {
  asteroid.health -= n
  if (asteroid.health <= 0) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
      const x = asteroid.x + asteroid.r * Math.cos(a) * 0.25
      const y = asteroid.y + asteroid.r * Math.sin(a) * 0.25
      const r = asteroid.r / 4
      const p = createParticle(state, x, y, r, 'rock', { drag: 0.003 })
      moveAngle(p, 10, a)
    }
  }
}