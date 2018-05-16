export default class Keyboard {
  constructor() {
    this.keys = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowUp': 'forward',
      ' ': 'shoot'
    }
    // this.state = { left: false, right: false, forward: false, shoot: false }
    this.callback = () => { }
    document.addEventListener('keydown', e => { this.setKey(e, true) })
    document.addEventListener('keyup', e => { this.setKey(e, false) })
  }
  onChange(callback) {
    this.callback = callback
  }
  setKey(e, state) {
    const input = this.keys[e.key]
    if (!input) return
    this.callback(input, state)
    e.preventDefault()
  }
}
