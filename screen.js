class Screen {
  constructor(id) {
    this.el = document.getElementById(id)
    this.ctx = this.el.getContext('2d')
    this.frame = 0
    Object.assign(this.el.style, {
      backgroundColor: '#000000',
      position: 'absolute',
      left: '0',
      top: '0',
    })
    this.size()
    window.addEventListener('resize', throttle(() => this.size(), 250))
  }
  size() {
    this.width = this.el.width = window.innerWidth
    this.height = this.el.height = window.innerHeight
  }
  draw(ms, time, ship, cam, bullets, stars, asteroids, bounds) {
    this.frame++
    const opacity = Math.min(1, ms / 60)
    this.ctx.save()
    this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
    this.ctx.fillRect(0, 0, this.el.width, this.el.height)
    this.drawStars(this.ctx, stars, cam)
    this.ctx.translate(this.el.width * 0.5, this.el.height * 0.5)
    this.drawCam(this.ctx, cam)
    this.drawShip(this.ctx, time, ship)
    this.drawAsteroids(this.ctx, asteroids)
    this.drawBullets(this.ctx, bullets)
    this.ctx.restore()
  }
  drawStars(ctx, stars, cam) {
    ctx.save()
    stars.forEach(s => {
      ctx.fillStyle = s.c
      const ratio = (1 - s.z / 100)
      const size = 1 + 3 * ratio
      let x = s.x - cam.x * ratio
      let y = s.y - cam.y * ratio
      while (x < 0) x += this.width
      while (x > this.width) x -= this.width
      while (y < 0) y += this.height
      while (y > this.height) y -= this.height
      ctx.fillRect(x, y, size, size)
    })
    ctx.restore()
  }
  drawCam(ctx, cam) {
    ctx.translate(-cam.x, -cam.y)
  }
  drawShip(ctx, time, ship) {
    const len = Math.sqrt(ship.size * ship.size * 0.5)
    ctx.save()
    ctx.translate(ship.x, ship.y)
    ctx.save()
    ctx.rotate(ship.angle)
    ctx.beginPath()
    ctx.fillStyle = '#00bbbb'
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 3
    ctx.moveTo(ship.size, 0)
    ctx.lineTo(-len, ship.size)
    ctx.lineTo(-len * 1.2, ship.size)
    ctx.lineTo(-len * 0.5, len * 0.5)
    ctx.lineTo(-len, 0)
    ctx.lineTo(-len * 0.5, -len * 0.5)
    ctx.lineTo(-len * 1.2, -ship.size)
    ctx.lineTo(-len, -ship.size)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    if (ship.thrusting && this.frame % 4 === 0) {
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(-ship.size, len * 0.5, len * 0.75, 0, Math.PI * 2)
      ctx.arc(-ship.size, -len * 0.5, len * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }
    if (ship.events.includes('shoot')) {
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(ship.size * 1.9, 0, ship.size * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(ship.callsign, 0, ship.size * 2);
    ctx.restore()
  }
  drawBullets(ctx, bullets) {
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffff00'
    ctx.lineWidth = 5
    bullets.forEach(b => {
      ctx.moveTo(b.x, b.y)
      ctx.arc(b.x, b.y, b.size, b.angle - Math.PI * 0.7, b.angle + Math.PI * 0.7)
      ctx.lineTo(b.x, b.y)
    })
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    bullets.forEach(b => {
      if (!b.splashed) return
      ctx.moveTo(b.x, b.y)
      ctx.arc(b.x, b.y, b.size * 2, 0, Math.PI * 2)
    })
    ctx.fill()
    ctx.restore()
  }
  drawAsteroids(ctx, asteroids) {
    ctx.save()
    ctx.fillStyle = '#330000'
    ctx.strokeStyle = '#ff7700'
    ctx.lineWidth = 5
    asteroids.forEach(a => {
      ctx.beginPath()
      ctx.moveTo(a.x + a.size, a.y)
      ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
    ctx.restore()
  }
}

function throttle(fn, interval) {
  let dirty = false
  return function () {
    if (dirty) return
    dirty = true
    setTimeout(() => { fn(); dirty = false }, interval)
  }
}