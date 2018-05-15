class Game {
  constructor(limit) {
    this.limit = limit
    this.started = 0
    this.events = []
    this.frameState = {}
  }
  commit(action) {
    const event = new Event(action)
    this.trim(100)
    let insert = this.events.findIndex(e => e.action.time >= action.time)
    if (insert >= 0) {
      this.events.splice(insert, 0, event)
    } else {
      insert = this.events.push(event) - 1
    }
    for (let i = insert; i < this.events.length; i++) {
      const prev = this.events[i - 1] || new Event()
      this.events[i] = this.transform(prev.state, this.events[i].action)
    }
    return this.state()
  }
  start() {
    this.started = performance.now()
  }
  trim(n) {
    if (this.events.length > n) {
      this.events = this.events.slice(this.events.length - n)
    }
  }
  transform(prevState, action) {
    const state = cloneDeep(prevState)
    state.limit = this.limit
    state.time = action.time
    ships(state, action)
    smokes(state, action) // TODO: filter this out from state()
    asteroids(state, action)
    bullets(state, action)
    return new Event(action, state)
  }
  state() {
    const e = this.events[this.events.length - 1] || new Event()
    return e.state
  }
  frame() {
    // TODO: how should this be diffent?
    return this.state()
  }
  eventsSince(time) {
    const i = this.events.findIndex(e => e.time >= event.time) || this.events.length
    return this.events.slice(i)
  }
}

class Event {
  constructor(action = {}, state = {}) {
    this.action = action
    this.state = state
    // this.state.time = action.time
  }
}

class Action {
  constructor(name, source, time) {
    this.name = name
    this.source = source
    this.time = time || performance.now()
  }
  set(props) {
    Object.assign(this, props)
    return this
  }
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj))
}