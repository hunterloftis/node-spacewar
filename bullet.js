class Bullet {
  constructor(x, y, angle, time) {
    this.x = x
    this.y = y
    this.angle = angle
    this.lifetime = time + 2000
    this.vel = 6
    this.size = 12
    this.splashed = false
  }
  update(ms, time) {
    const vx = this.vel * Math.cos(this.angle)
    const vy = this.vel * Math.sin(this.angle)
    this.x += vx
    this.y += vy
    return time < this.lifetime
  }
  hits(x, y, r) {
    const dx = this.x - x
    const dy = this.y - y
    const d = Math.sqrt(dx * dx + dy * dy)
    return d < this.size + r
  }
  splash() {
    this.splashed = true
  }
  frame() {
    const f = {
      x: this.x,
      y: this.y,
      size: this.size,
      angle: this.angle,
      splashed: this.splashed,
    }
    if (this.splashed) this.lifetime = 0
    return f
  }
}