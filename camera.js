class Camera {
  constructor(x, y) {
    this.delay = 1000
    this.x = x
    this.y = y
  }
  update(ms, ship) {
    const lead = ship.size * 15
    const tx = ship.x + lead * Math.cos(ship.angle)
    const ty = ship.y + lead * Math.sin(ship.angle)
    const dx = tx - this.x
    const dy = ty - this.y
    const t = Math.min(1, ms / this.delay)
    this.x += dx * t
    this.y += dy * t
  }
}
