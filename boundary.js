class Boundary {
  constructor(radius) {
    this.r = radius
  }
  correct(x, y, size) {
    const len = Math.sqrt(x * x + y * y)
    const r = this.r - size
    if (len <= r) return { x, y }
    const ratio = r / len
    return { x: x * ratio, y: y * ratio }
  }
}