const agility = 0.003
const speed = 0.05
const spread = 0.1
const interval = 70
const kick = 0.1

function ships(state, action) {
  if (!state.ships) state.ships = []
  if (action.name === 'join') {
    state.ships.push({
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      drag: 0.002,
      r: 14,
      angle: -Math.PI * 0.5,
      health: 100,
      bullet: 0,
      callsign: action.callsign,
      playerId: action.playerId,
      input: { left: false, right: false, forward: false, shoot: false },
    })
  }
  else if (action.name === 'input') {
    const ship = state.ships.find(s => s.playerId === action.playerId)
    if (!ship) return
    ship.input[action.input] = action.value
  }
  else if (action.name === 'tick') {
    state.ships.forEach(ship => {
      integrate(ship)
      if (ship.input.left) ship.angle -= action.ms * agility
      if (ship.input.right) ship.angle += action.ms * agility
      if (ship.input.forward) moveAngle(ship, speed, ship.angle)
      if (ship.input.shoot && state.time >= ship.bullet) {
        const ba = ship.angle + (Math.random() - 0.5) * spread * Math.PI
        const bx = ship.x + ship.r * Math.cos(ba) * 2
        const by = ship.y + ship.r * Math.sin(ba) * 2
        createBullet(state, bx, by, ba, state.time)
        moveAngle(ship, -kick, ship.angle)
        ship.bullet = state.time + interval
      }
    })
  }
}

function integrate(body) {
  const vx = body.x - body.x1
  const vy = body.y - body.y1
  const speed = Math.sqrt(vx * vx + vy * vy)
  const drag = Math.min(1, speed * speed * body.drag)
  body.x1 = body.x
  body.y1 = body.y
  body.x += vx * (1 - drag)
  body.y += vy * (1 - drag)
}

function moveAngle(body, dist, angle) {
  body.x += dist * Math.cos(angle)
  body.y += dist * Math.sin(angle)
}