class Ship {
  constructor(x, y) {
    this.body = new Body(x, y, 14, 0.002)
    this.angle = -Math.PI * 0.5
    this.thrusting = false
    this.turning = 0
    this.speed = 0.05
    this.agility = 0.003
    this.bulletInterval = this.bulletMin = 70
    this.bulletNext = 0
    this.spread = 0.1
    this.kick = 0.1
    this.snapshot = {}
    this.health = this.maxHealth = 100
    this.smokeNext = 0
    this.deadTime = 0
  }
  update(ms, time, actions, bullets, limit, smoke) {
    this.body.update(ms)
    if (this.health > 0) {
      this.turn(ms, actions.left, actions.right)
      this.thrust(ms, actions.forward)
      this.shoot(ms, time, actions.shoot, bullets)
    } else {
      this.deadTime += ms
    }
    this.leak(time, smoke)
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
    if (this.health <= 0) return
    this.health -= n
    this.snapshot.damaged = true
    if (this.health <= 0) {
      this.snapshot.exploded = true
      this.body.drag = 0.005
    }
  }
  leak(time, smoke) {
    if (time < this.smokeNext) return
    const h = Math.max(0, this.health / this.maxHealth)
    if (h < 0.9 && this.deadTime < 3000) {
      const ba = this.angle + Math.PI + (Math.random() - 0.5) * Math.PI * 0.5
      const bx = this.body.x + this.body.r * Math.cos(ba) * 1.25
      const by = this.body.y + this.body.r * Math.sin(ba) * 1.25
      const s = new Smoke(bx, by, this.body.r * 1.25)
      s.body.moveAngle(Math.random(), Math.random() * Math.PI * 2)
      smoke.add(s)
      this.smokeNext = time + 50 + 1000 * (0.01 + h) * (1 + this.deadTime / 500)
    }
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
      health: this.health,
    }
    this.snapshot = {}
    return f
  }
}
