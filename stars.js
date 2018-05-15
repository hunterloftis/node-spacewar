class Stars {
  constructor(density) {
    this.points = this.randomized(density)
    window.addEventListener('resize', () => { this.points = this.randomized(density) })
  }
  randomized(density) {
    const width = window.innerWidth
    const height = window.innerHeight
    const area = width * height
    const n = area * density
    const points = []
    for (let i = 0; i < n; i++) {
      const r = Math.random()
      const g = r + Math.random() * 0.5
      const b = g + Math.random() * 0.25
      const ratio = 255 * 1 / Math.sqrt(r * r + g * g + b * b)
      const color = `rgba(${r * ratio}, ${g * ratio}, ${b * ratio}, 1)`
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.max(1, Math.random() * 125 - 25),
        c: color
      })
    }
    return points
  }
}
