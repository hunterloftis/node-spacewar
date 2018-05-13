class Camera {
  constructor(x, y) {
    this.delay = 1000
    this.x = x
    this.y = y
  }
  update(ms, ship, limit, width, height) {
    const mx = limit - width * 0.5
    const my = limit - height * 0.5
    const lead = ship.size * 10
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
