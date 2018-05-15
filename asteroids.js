function asteroids(state, action) {
  if (!state.asteroids) state.asteroids = []
  state.lasteroid = state.lasteroid || 0
  if (action.name === 'tick') {
    state.asteroids = state.asteroids.filter(a => {
      const lim = state.limit + a.r * 2
      if (Math.abs(a.x) > lim || Math.abs(a.y) > lim) return false
      return a.health > 0
    })
    if (state.asteroids.length < 50 && state.lasteroid < state.time - 500) {
      const r = 15 + Math.random() * 30
      const l = state.limit + r
      let x, y
      if (Math.random() > 0.5) {
        x = Math.random() > 0.5 ? l : -l
        y = (Math.random() - 0.5) * state.limit
      } else {
        x = (Math.random() - 0.5) * state.limit
        y = Math.random() > 0.5 ? l : -l
      }
      const tx = (Math.random() - 0.5) * state.limit
      const ty = (Math.random() - 0.5) * state.limit
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
    state.asteroids.forEach(asteroid => {
      integrate(asteroid)
    })
  }
}

function damageAsteroid(asteroid, n) {
  asteroid.health -= n
}