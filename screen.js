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
  draw(ms, time, ship, cam, bullets, stars, asteroids, smoke) {
    this.frame++
    const opacity = Math.min(1, ms / 60)
    this.ctx.save()
    this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
    this.ctx.fillRect(0, 0, this.el.width, this.el.height)
    this.drawStars(this.ctx, stars, cam)
    this.ctx.translate(this.el.width * 0.5, this.el.height * 0.5)
    this.drawCam(this.ctx, cam)
    this.drawAsteroids(this.ctx, asteroids)
    this.drawBullets(this.ctx, bullets)
    this.drawSmoke(this.ctx, smoke)
    this.drawShip(this.ctx, time, ship)
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
  drawSmoke(ctx, smoke) {
    ctx.save()
    ctx.fillStyle = '#643A71'
    ctx.beginPath()
    smoke.forEach(s => {
      ctx.moveTo(s.body.x, s.body.y)
      ctx.arc(s.body.x, s.body.y, s.body.r, 0, Math.PI * 2)
    })
    ctx.fill()
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
    ctx.fillStyle = '#00ffff'
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 1
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
    if (ship.snapshot.shooting) {
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(ship.size * 1.75, 0, ship.size * 1.25, 0, Math.PI * 2)
      ctx.fill()
    }
    if (ship.snapshot.damaged) {
      const x = (Math.random() - 0.5) * ship.size * 2
      const y = (Math.random() - 0.5) * ship.size * 2
      const r = ship.size * 1.5
      ctx.beginPath()
      ctx.fillStyle = Math.random() > 0.5 ? '#D90368' : '#FFaaff'
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(ship.callsign, 0, ship.size * 2.5);
    ctx.restore()
  }
  drawBullets(ctx, bullets) {
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#fff577'
    ctx.strokeStyle = '#E8C547'
    ctx.lineWidth = 5
    bullets.forEach(b => {
      ctx.moveTo(b.x, b.y)
      ctx.arc(b.x, b.y, b.size, b.angle - Math.PI * 0.7, b.angle + Math.PI * 0.7)
      ctx.lineTo(b.x, b.y)
    })
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    bullets.forEach(b => {
      if (!b.splashed) return
      ctx.moveTo(b.x, b.y)
      ctx.arc(b.x, b.y, b.size * 1, 0, Math.PI * 2)
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2
        const x = b.size * 2 * Math.cos(a)
        const y = b.size * 2 * Math.sin(a)
        ctx.moveTo(b.x, b.y)
        ctx.lineTo(b.x + x, b.y + y)
      }
    })
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
  drawAsteroids(ctx, asteroids) {
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#D90368'
    asteroids.forEach(a => {
      ctx.moveTo(a.body.x, a.body.y)
      ctx.arc(a.body.x, a.body.y, a.body.r, 0, Math.PI * 2)
    })
    ctx.fill()
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