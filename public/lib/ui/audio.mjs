// https://css-tricks.com/introduction-web-audio-api/
// https://noisehack.com/generate-noise-web-audio-api/#demo
// https://codepen.io/gregh/post/recreating-legendary-8-bit-games-music-with-web-audio-api

class Audio {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.engines = this.context.createOscillator()
    this.engines.type = 'sine'
    this.engines.frequency.value = 131
    this.engines.start()
    const resume = () => {
      document.removeEventListener('keydown', resume)
      document.removeEventListener('click', resume)
      this.context.resume()
    }
    document.addEventListener('keydown', resume)
    document.addEventListener('click', resume)
  }
  play(ms, time, ship) {
    if (ship.snapshot.shooting) this.shoot()
    if (ship.thrusting) this.engines.connect(this.context.destination)
    else this.engines.disconnect()
  }
  shoot() {
    const now = this.context.currentTime
    const sound = this.context.createOscillator()
    sound.type = 'triangle'
    sound.frequency.value = 110
    sound.connect(this.context.destination)
    sound.start(now)
    sound.stop(now + 0.1)
  }
  thrust() {

  }
}
