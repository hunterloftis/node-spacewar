import { integrate, moveAngle } from './bodies.mjs'

export function smokes(state, action) {
  if (!state.smokes) state.smokes = []
  if (action.name === 'tick') {
    state.smokes = state.smokes.filter(s => s.r > 3)
    state.smokes.forEach(s => {
      integrate(s)
      s.r *= 0.99
    })
  }
}

export function createSmoke(state, x, y, r) {
  if (!state.smokes) state.smokes = []
  const smoke = {
    x, y, r,
    x1: x, y1: y,
    drag: 0.05
  }
  moveAngle(smoke, Math.random(), Math.random() * Math.PI * 2)
  state.smokes.push(smoke)
}