class Asteroid {
  constructor(radius) {
    this.size = 25 + Math.random() * 50
    const a = Math.random() * Math.PI * 2
    const r = radius - this.size * 0.5
    const d = Math.sqrt(Math.random() * r * r)
    this.x = d * Math.cos(a)
    this.y = d * Math.sin(a)
    this.angle = Math.random() * Math.PI * 2
    this.vel = 1
  }
  update(ms) {
    this.x += this.vel * Math.cos(this.angle)
    this.y += this.vel * Math.sin(this.angle)
  }
}