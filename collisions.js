function collisions(state, action) {
  if (action.name === 'tick') {
    state.ships.forEach(s => {
      s.hurting = false
      if (s.health <= 0) return
      state.asteroids.forEach(a => {
        if (hits(a, s)) {
          s.hurting = true
          s.health -= 1
          if (s.health <= 0) {
            s.drag = 0.005
            s.death = state.time
          }
        }
      })
    })
  }
}

function hits(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const d = Math.sqrt(dx * dx + dy * dy)
  return d < a.r + b.r
}

  //   bullets.forEach(b => {
  //     if (!b.update(ms, time)) bullets.delete(b)
  //   })
  //   asteroids.forEach(a => {
  //     if (!a.update(ms, limit)) asteroids.delete(a)
  //   })
  //   smoke.forEach(s => {
  //     if (!s.update(ms, time)) smoke.delete(s)
  //   })
  //   bullets.forEach(b => {
  //     asteroids.forEach(a => {
  //       if (b.body.hits(a.body)) {
  //         b.splash()
  //         a.hurt(1)
  //       }
  //     })
  //   })
  //   asteroids.forEach(a => {
  //     if (a.body.hits(ship.body)) {
  //       ship.damage(1)
  //     }
  //   })
// }