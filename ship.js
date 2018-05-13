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
    this.bulletMin = 70
    this.bulletInterval = this.bulletMin
    this.bulletNext = 0
    this.spread = 0.1
    this.kick = 0.1
    this.events = new Set()
  }
  update(ms, time, actions, bullets, limit) {
    this.integrate(ms)
    this.turn(ms, actions.left, actions.right)
    this.thrust(ms, actions.forward)
    this.shoot(ms, time, actions.shoot, bullets)
    this.contain(limit)
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
    if (!shooting) {
      this.bulletInterval = Math.max(this.bulletMin, this.bulletInterval * 0.99)
      return
    }
    if (this.bulletNext > time) return
    const ba = this.angle + (Math.random() - 0.5) * this.spread * Math.PI
    const bx = this.x + this.size * Math.cos(ba) * 2
    const by = this.y + this.size * Math.sin(ba) * 2

    bullets.add(new Bullet(bx, by, ba, time))
    this.bulletInterval *= 1.05
    this.bulletNext = time + this.bulletInterval
    this.x += this.kick * -Math.cos(this.angle)
    this.y += this.kick * -Math.sin(this.angle)
    this.events.add('shoot')
  }
  contain(limit) {
    const l = limit - this.size
    if (this.x < -l) this.x = -l
    else if (this.x > l) this.x = l
    if (this.y < -l) this.y = -l
    else if (this.y > l) this.y = l
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
      callsign: 'Hunter',
    }
    this.events.clear()
    return f
  }
}
