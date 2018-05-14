class Ship {
  constructor(x, y) {
    this.body = new Body(x, y, 12, 0.002)
    this.angle = -Math.PI * 0.5
    this.thrusting = false
    this.turning = 0
    this.speed = 0.05
    this.agility = 0.003
    this.bulletMin = 70
    this.bulletInterval = this.bulletMin
    this.bulletNext = 0
    this.spread = 0.1
    this.kick = 0.1
    this.snapshot = {}
    this.health = 20
  }
  update(ms, time, actions, bullets, limit) {
    this.body.update(ms)
    this.turn(ms, actions.left, actions.right)
    this.thrust(ms, actions.forward)
    this.shoot(ms, time, actions.shoot, bullets)
    this.body.contain(limit)
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
    this.body.moveAngle(this.speed, this.angle)
  }
  shoot(ms, time, shooting, bullets) {
    if (!shooting) {
      this.bulletInterval = Math.max(this.bulletMin, this.bulletInterval * 0.99)
      return
    }
    if (this.bulletNext > time) return
    const ba = this.angle + (Math.random() - 0.5) * this.spread * Math.PI
    const bx = this.body.x + this.body.r * Math.cos(ba)
    const by = this.body.y + this.body.r * Math.sin(ba)

    bullets.add(new Bullet(bx, by, ba, time))
    this.bulletInterval *= 1.05
    this.bulletNext = time + this.bulletInterval
    this.body.moveAngle(-this.kick, this.angle)
    this.snapshot.shooting = true
  }
  damage(n) {
    this.health -= n
    this.snapshot.damaged = true
  }
  frame() {
    const f = {
      snapshot: this.snapshot,
      x: this.body.x,
      y: this.body.y,
      size: this.body.r,
      angle: this.angle,
      thrusting: this.thrusting,
      turning: this.turning,
      callsign: 'Hunter',
    }
    this.snapshot = {}
    return f
  }
}
