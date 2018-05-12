class Keyboard {
  constructor() {
    this.keys = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowUp': 'forward',
      ' ': 'shoot'
    }
    this.state = { left: false, right: false, forward: false, shoot: false }
    document.addEventListener('keydown', e => { this.setKey(e, true) })
    document.addEventListener('keyup', e => { this.setKey(e, false) })
  }
  setKey(e, state) {
    const action = this.keys[e.key]
    if (!action) return
    this.state[action] = state
    e.preventDefault()
  }
  actions() {
    return this.state
  }
}
