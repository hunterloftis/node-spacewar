class Bullet {
  constructor(x, y, angle, time) {
    this.angle = angle
    this.body = new Body(x, y, 12, 0)
    this.body.moveAngle(7, angle)
    this.lifetime = time + 2000
    this.splashed = false
  }
  update(ms, time) {
    this.body.update(ms)
    return time < this.lifetime
  }
  splash() {
    this.splashed = true
  }
  frame() {
    const f = {
      x: this.body.x,
      y: this.body.y,
      x1: this.body.x1,
      y1: this.body.y1,
      size: this.body.r,
      angle: this.angle,
      splashed: this.splashed,
    }
    if (this.splashed) this.lifetime = 0
    return f
  }
}