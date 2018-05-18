import { ships } from './ships.mjs'
import { particles } from './particles.mjs'
import { asteroids } from './asteroids.mjs'
import { bullets } from './bullets.mjs'
import { collisions } from './collisions.mjs'
import { clock } from './clock.mjs'
import Id from './id.mjs'

const HISTORY = 500

export class Game {
  constructor(host, limit) {
    this.host = host
    this.limit = limit
    this.id = ''
    this.snapshot = null // the last confirmed state
    this.state = {}       // the unconfirmed state from the same action as the confirmed state
    this.actions = []     // all the actions that happened since the confirmed state
  }
  setId(id) {
    this.id = id
  }
  joinAction(callsign) {
    return Action(this.id, 'join', { callsign })
  }
  leaveAction(id) {
    return Action(id, 'leave')
  }
  inputAction(input, value) {
    return Action(this.id, 'input', { input, value })
  }
  tickAction(ms) {
    return Action(this.id, 'tick', { ms })
  }
  pingAction() {
    return Action(this.id, 'ping')
  }
  update(snapshot, actionId) {
    let tail = this.actions.findIndex(a => {
      return a.id === actionId
    })
    if (tail < 0) {
      console.log('no match for action.id:', actionId)
      return
    }
    this.snapshot = snapshot
    this.state = this.reduce().state
    // this.state = cloneDeep(snapshot.state) // TODO: for demo, no blending
    this.actions = this.actions.slice(tail + 1)
  }
  blend(n) {
    if (!this.snapshot) return
    const dest = this.state
    const src = cloneDeep(this.snapshot.state)
    dest.time = src.time
    dest.limit = src.limit
    if (dest.ships) {
      dest.ships.filter(s1 => {
        return src.ships.find(s2 => s2.id === s1.id)
      })
      src.ships.forEach(s2 => {
        const s1 = dest.ships.find(s1 => s1.id === s2.id)
        if (!s1) {
          dest.ships.push(s2)
          return
        }
        s1.x += (s2.x - s1.x) * n
        s1.y += (s2.y - s1.y) * n
        s1.x1 += (s2.x1 - s1.x1) * n
        s1.y1 += (s2.y1 - s1.y1) * n
        s1.angle += (s2.angle - s1.angle) * n

        s1.drag = s2.drag
        s1.r = s2.r
        s1.health = s2.health
        s1.bullet = s2.bullet
        s1.interval = s2.interval
        s1.hurting = s2.hurting
        s1.death = s2.death
        s1.callsign = s2.callsign
        s1.input = s2.input
      })
    }
    else {
      dest.ships = src.ships
    }
    dest.asteroids = src.asteroids
    dest.bullets = src.bullets
  }
  commit(action, time) {
    const overflow = this.actions.length - HISTORY
    if (overflow > 0) {
      this.state = this.reduce(false, overflow).state
      this.actions = this.actions.slice(overflow)
      this.snapshot = null
    }
    action.time = time
    let insert = this.actions.findIndex(a => a.time >= action.time)
    if (insert >= 0) {
      this.actions.splice(insert, 0, action)
      return insert
    } else {
      this.actions.push(action)
      return this.actions.length - 1
    }
  }
  reduce(minimal = false, limit = this.actions.length) {
    if (this.actions.length < 1) {
      throw new Error('no actions to reduce!')
    }
    let state = cloneDeep(this.state)
    for (let i = 0; i < limit; i++) {
      this.transform(state, this.actions[i])
    }
    if (minimal) {
      state = {
        limit: state.limit,
        time: state.time,
        ships: state.ships,
        asteroids: state.asteroids,
        bullets: state.bullets
      }
    }
    const finalAction = this.actions[this.actions.length - 1]
    return Snapshot(finalAction, finalAction.time, state)
  }
  transform(state, action) {
    state.limit = this.limit
    clock(state, action)
    ships(state, action)
    particles(state, action)
    asteroids(state, action, this.host)
    bullets(state, action)
    collisions(state, action, this.host)
  }
}

function Snapshot(action, time, state = {}) {
  return { id: Id(), action, time, state }
}

function Action(source, name, props) {
  return { id: Id(), source, name, time: 0, ...props }
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj))
}