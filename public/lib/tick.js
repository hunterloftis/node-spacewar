export default function Tick(tick, update, render) {
  let stopped = false
  let time = performance.now()
  requestAnimationFrame(frame)
  return stop

  function frame() {
    if (stopped) return
    let now = performance.now()
    if (time < now - 200) time = now - 200
    let prev = time
    for (let t = time; t <= now; t += tick) {
      time = t
      update(tick, time)
    }
    render(now - prev, now)
    requestAnimationFrame(frame)
  }

  function stop() {
    stopped = true
  }
}