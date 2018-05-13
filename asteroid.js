class Asteroid {
  constructor(limit) {
    this.size = 15 + Math.random() * 30
    const l = limit + this.size
    if (Math.random() > 0.5) {
      this.x = Math.random() > 0.5 ? l : -l
      this.y = (Math.random() - 0.5) * limit
    } else {
      this.x = (Math.random() - 0.5) * limit
      this.y = Math.random() > 0.5 ? l : -l
    }
    const tx = (Math.random() - 0.5) * limit
    const ty = (Math.random() - 0.5) * limit
    const dx = tx - this.x
    const dy = ty - this.y
    this.angle = Math.atan2(dy, dx)
    this.vel = 1
    this.health = 2
  }
  update(ms, limit) {
    this.x += this.vel * Math.cos(this.angle)
    this.y += this.vel * Math.sin(this.angle)
    const lim = limit + this.size * 2
    if (Math.abs(this.x) > lim || Math.abs(this.y) > lim) {
      this.health = 0
    }
    return this.health > 0
  }
  hurt(n) {
    this.health -= n
  }
}