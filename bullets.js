function bullets(state, action) {
  if (!state.bullets) state.bullets = []
}

function createBullet(state, x, y, angle, time) {
  if (!state.bullets) state.bullets = []
  const b = {
    x, y, angle,
    lifetime: time + 2000,
    splashed: false,
    drag: 0,
    r: 12,
  }
  moveAngle(b, 7, angle)
  state.bullets.push(b)
}