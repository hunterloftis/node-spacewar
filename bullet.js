class Bullet {
  constructor(x, y, angle, time) {
    this.x = x
    this.y = y
    this.angle = angle
    this.death = time + 2000
    this.vel = 6
    this.size = 12
  }
  update(ms, time) {
    const vx = this.vel * Math.cos(this.angle)
    const vy = this.vel * Math.sin(this.angle)
    this.x += vx
    this.y += vy
    return time < this.death
  }
}