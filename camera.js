class Camera {
  constructor() {
    this.delay = 1000
    this.x = 0
    this.y = 0
  }
  update(ms, state, width, height) {
    const ship = state.ships[0]
    if (!ship) return
    const mx = state.limit - width * 0.5
    const my = state.limit - height * 0.5
    const lead = ship.r * 10
    const tx = ship.x + lead * Math.cos(ship.angle)
    const ty = ship.y + lead * Math.sin(ship.angle)
    const dx = tx - this.x
    const dy = ty - this.y
    const t = Math.min(1, ms / this.delay)
    this.x += dx * t
    this.y += dy * t
    if (this.x < -mx) this.x = -mx
    else if (this.x > mx) this.x = mx
    if (this.y < -my) this.y = -my
    else if (this.y > my) this.y = my
  }
}
