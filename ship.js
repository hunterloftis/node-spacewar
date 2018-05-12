class Ship {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.x1 = x
    this.y1 = y
    this.angle = -Math.PI * 0.5
    this.thrusting = false
    this.turning = 0
    this.size = 12
    this.drag = 0.002
    this.speed = 0.05
    this.agility = 0.003
    this.bulletInterval = 100
    this.bulletNext = 0
    this.spread = 0.25
    this.kick = 0.5
    this.events = new Set()
  }
  update(ms, time, actions, bullets) {
    this.integrate(ms)
    this.turn(ms, actions.left, actions.right)
    this.thrust(ms, actions.forward)
    this.shoot(ms, time, actions.shoot, bullets)
  }
  integrate(ms) {
    const vx = (this.x - this.x1)
    const vy = (this.y - this.y1)
    const speed = Math.sqrt(vx * vx + vy * vy)
    const drag = Math.min(1, speed * speed * this.drag)
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx * (1 - drag)
    this.y += vy * (1 - drag)
  }
  turn(ms, left, right) {
    const a = this.angle
    if (left) this.angle -= ms * this.agility
    if (right) this.angle += ms * this.agility
    this.turning = this.angle - a
  }
  thrust(ms, forward) {
    this.thrusting = forward
    if (!this.thrusting) return
    const ax = this.speed * Math.cos(this.angle)
    const ay = this.speed * Math.sin(this.angle)
    this.x += ax
    this.y += ay
  }
  shoot(ms, time, shooting, bullets) {
    if (!shooting) return
    if (this.bulletNext > time) return
    const bx = this.x + this.size * Math.cos(this.angle) * 2
    const by = this.y + this.size * Math.sin(this.angle) * 2
    const ba = this.angle + (Math.random() - 0.5) * this.spread
    bullets.add(new Bullet(bx, by, ba, time))
    this.bulletNext = time + this.bulletInterval
    this.x += this.kick * -Math.cos(this.angle)
    this.y += this.kick * -Math.sin(this.angle)
    this.events.add('shoot')
  }
  frame() {
    const f = {
      events: Array.from(this.events),
      x: this.x,
      y: this.y,
      size: this.size,
      angle: this.angle,
      thrusting: this.thrusting,
      turning: this.turning,
    }
    this.events.clear()
    return f
  }
}
