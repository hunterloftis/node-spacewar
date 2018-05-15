import { integrate, contain, moveAngle } from './bodies.js'
import { createBullet } from './bullets.js'
import { createSmoke } from './smokes.js'

const agility = 0.003
const speed = 0.05
const spread = 0.1
const kick = 0.1

export function ships(state, action) {
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
      interval: 70,
      smoke: 0,
      hurting: false,
      death: 0,
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
      if (ship.health > 0) {
        if (ship.input.left) ship.angle -= action.ms * agility
        if (ship.input.right) ship.angle += action.ms * agility
        if (ship.input.forward) moveAngle(ship, speed, ship.angle)
        if (!ship.input.shoot) {
          ship.interval = Math.max(70, ship.interval * 0.98)
        } else if (state.time >= ship.bullet) {
          const ba = ship.angle + (Math.random() - 0.5) * spread * Math.PI
          const bx = ship.x + ship.r * Math.cos(ba) * 2
          const by = ship.y + ship.r * Math.sin(ba) * 2
          createBullet(state, bx, by, ba, state.time)
          moveAngle(ship, -kick, ship.angle)
          ship.bullet = state.time + ship.interval
          ship.interval *= 1.1
        }
      }
      const smoking = ship.health < 100 && ship.health > 0
      const onFire = ship.death > 0 && ship.death > state.time - 2000
      if ((smoking || onFire) && state.time > ship.smoke) {
        const h = ship.health / 100
        const d = ship.death ? (state.time - ship.death) / 2000 : 0
        const sa = ship.angle + (Math.random() - 0.5) * Math.PI * 0.5 + Math.PI
        const sx = ship.x + ship.r * Math.cos(sa) * 1.25
        const sy = ship.y + ship.r * Math.sin(sa) * 1.25
        createSmoke(state, sx, sy, ship.r * 1.25)
        ship.smoke = state.time + 50 + 100 * h + 1000 * d
      }
      contain(ship, state.limit)
    })
  }
}

export function damageShip(ship, n, time) {
  ship.hurting = true
  ship.health -= n
  if (ship.health <= 0) {
    ship.drag = 0.005
    ship.death = time
  }
}