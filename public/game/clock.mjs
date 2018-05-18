export function clock(state, action) {
  if (!state.time) state.time = 0
  if (action.name === 'tick') {
    state.time += action.ms
  }
}