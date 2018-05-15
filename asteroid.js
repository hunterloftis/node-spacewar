class Asteroid {
  constructor(limit) {
    const r = 15 + Math.random() * 30
    const l = limit + r
    let x, y
    if (Math.random() > 0.5) {
      x = Math.random() > 0.5 ? l : -l
      y = (Math.random() - 0.5) * limit
    } else {
      x = (Math.random() - 0.5) * limit
      y = Math.random() > 0.5 ? l : -l
    }
    const tx = (Math.random() - 0.5) * limit
    const ty = (Math.random() - 0.5) * limit
    const dx = tx - x
    const dy = ty - y
    const angle = Math.atan2(dy, dx)
    this.body = new Body(x, y, r, 0)
    this.body.moveAngle(1, angle)
    this.health = Math.ceil(5 * r / 45)
    this.edges = 5 + Math.floor(Math.random() * 4)
  }
  update(ms, limit) {
    this.body.update(ms)
    const lim = limit + this.body.r * 2
    if (Math.abs(this.body.x) > lim || Math.abs(this.body.y) > lim) {
      this.health = 0
    }
    return this.health > 0
  }
  hurt(n) {
    this.health -= n
  }
}