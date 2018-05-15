function smokes(state, action) {
  if (!state.smokes) state.smokes = []
  if (action.name === 'tick') {
    state.smokes = state.smokes.filter(s => s.r > 3)
    state.smokes.forEach(s => {
      integrate(s)
      s.r *= 0.99
    })
  }
}

function createSmoke(state, x, y, r) {
  if (!state.smokes) state.smokes = []
  state.smokes.push({
    x, y, r,
    x1: x, y1: y,
    drag: 0.05
  })
}