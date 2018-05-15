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
  draw(ms, time, state, cam, stars) {
    this.frame++
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.el.width, this.el.height)
    this.drawStars(this.ctx, stars, cam)
    this.ctx.translate(this.el.width * 0.5, this.el.height * 0.5)
    this.drawCam(this.ctx, cam)
    this.drawAsteroids(this.ctx, state.asteroids)
    this.drawBullets(this.ctx, state.bullets)
    this.drawSmokes(this.ctx, state.smokes)
    this.drawShips(this.ctx, time, state.ships)
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
  drawSmokes(ctx, smokes) {
    ctx.save()
    ctx.fillStyle = '#643A71'
    ctx.beginPath()
    smokes.forEach(s => {
      ctx.moveTo(s.body.x, s.body.y)
      ctx.arc(s.body.x, s.body.y, s.body.r, 0, Math.PI * 2)
    })
    ctx.fill()
    ctx.restore()
  }
  drawCam(ctx, cam) {
    ctx.translate(-cam.x, -cam.y)
  }
  drawShips(ctx, time, ships) {
    ships.forEach(ship => {
      const len = Math.sqrt(ship.r * ship.r * 0.5)
      ctx.save()
      ctx.translate(ship.x, ship.y)
      ctx.save()
      ctx.rotate(ship.angle)
      if (ship.health > 0) {
        ctx.beginPath()
        ctx.fillStyle = '#00ffff'
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 1
        ctx.moveTo(ship.r, 0)
        ctx.lineTo(-len, ship.r)
        ctx.lineTo(-len * 1.2, ship.r)
        ctx.lineTo(-len * 0.5, len * 0.5)
        ctx.lineTo(-len, 0)
        ctx.lineTo(-len * 0.5, -len * 0.5)
        ctx.lineTo(-len * 1.2, -ship.r)
        ctx.lineTo(-len, -ship.r)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        if (ship.input.forward && this.frame % 4 === 0) {
          ctx.beginPath()
          ctx.fillStyle = '#ffffff'
          ctx.arc(-ship.r, len * 0.5, len * 0.75, 0, Math.PI * 2)
          ctx.arc(-ship.r, -len * 0.5, len * 0.75, 0, Math.PI * 2)
          ctx.fill()
        }
        // if (ship.snapshot.shooting) {
        //   ctx.beginPath()
        //   ctx.fillStyle = '#ffffff'
        //   ctx.arc(ship.r * 1.75, 0, ship.r * 1.25, 0, Math.PI * 2)
        //   ctx.fill()
        // }
      }
      const exploded = ship.death && ship.death > time - 2000
      if (ship.hurting || exploded) {
        const x = (Math.random() - 0.5) * ship.r * 2
        const y = (Math.random() - 0.5) * ship.r * 2
        const r = ship.r * 1.5
        ctx.beginPath()
        ctx.fillStyle = Math.random() > 0.5 ? '#D90368' : '#FFaaff'
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      // if (ship.snapshot.exploded) {
      //   ctx.beginPath()
      //   ctx.fillStyle = '#ffffff'
      //   ctx.arc(0, 0, ship.r * 5, 0, Math.PI * 2)
      //   ctx.fill()
      // }
      ctx.restore()
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const text = ship.health > 0 ? ship.callsign : 'Press [space] to try again'
      ctx.fillText(text, 0, ship.r * 2.5);
      ctx.restore()
    })
  }
  drawBullets(ctx, bullets) {
    ctx.save()
    ctx.fillStyle = '#E8C547'
    bullets.forEach(b => {
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.angle)
      ctx.beginPath()
      ctx.moveTo(-b.r * 2, 0)
      ctx.lineTo(0, -b.r * 1.25)
      ctx.lineTo(b.r * 1, 0)
      ctx.lineTo(0, b.r * 1.25)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    bullets.forEach(b => {
      if (!b.splashed) return
      ctx.moveTo(b.x, b.y)
      ctx.arc(b.x, b.y, b.r * 1, 0, Math.PI * 2)
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2
        const x = b.r * 2 * Math.cos(a)
        const y = b.r * 2 * Math.sin(a)
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
      // TODO: draw polygon of a.edges edges
      ctx.moveTo(a.x, a.y)
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
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