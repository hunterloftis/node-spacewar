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
  update(ms, bullets) {
    this.x += this.vel * Math.cos(this.angle)
    this.y += this.vel * Math.sin(this.angle)
    const hit = bullets.find(b => {
      const dx = this.x - b.x
      const dy = this.y - b.y
      const d = Math.sqrt(dx * dx + dy * dy)
      return d < this.size + b.size
    })
    return !hit
  }
}