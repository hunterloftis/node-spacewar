class Body {
  constructor(x, y, r, drag) {
    this.x = this.x1 = x
    this.y = this.y1 = y
    this.r = r
    this.drag = drag
  }
  update(ms) {
    const vx = this.x - this.x1
    const vy = this.y - this.y1
    const speed = Math.sqrt(vx * vx + vy * vy)
    const drag = Math.min(1, speed * speed * this.drag)
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx * (1 - drag)
    this.y += vy * (1 - drag)
  }
  move(x, y) {
    this.x += x
    this.y += y
  }
  moveAngle(dist, angle) {
    this.x += dist * Math.cos(angle)
    this.y += dist * Math.sin(angle)
  }
  hits(body) {
    const dx = this.x - body.x
    const dy = this.y - body.y
    const d = Math.sqrt(dx * dx + dy * dy)
    return d < this.r + body.r
  }
  contain(limit) {
    const l = limit - this.r
    if (this.x < -l) this.x = -l
    else if (this.x > l) this.x = l
    if (this.y < -l) this.y = -l
    else if (this.y > l) this.y = l
  }
}