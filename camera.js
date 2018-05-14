class Camera {
  constructor(ship) {
    this.delay = 1000
    this.x = ship.body.x
    this.y = ship.body.y
  }
  update(ms, ship, limit, width, height) {
    const mx = limit - width * 0.5
    const my = limit - height * 0.5
    const lead = ship.body.r * 10
    const tx = ship.body.x + lead * Math.cos(ship.angle)
    const ty = ship.body.y + lead * Math.sin(ship.angle)
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
