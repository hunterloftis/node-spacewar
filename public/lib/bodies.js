export function integrate(body) {
  const vx = body.x - body.x1
  const vy = body.y - body.y1
  const speed = Math.sqrt(vx * vx + vy * vy)
  const drag = Math.min(1, speed * speed * body.drag)
  body.x1 = body.x
  body.y1 = body.y
  body.x += vx * (1 - drag)
  body.y += vy * (1 - drag)
}

export function moveAngle(body, dist, angle) {
  body.x += dist * Math.cos(angle)
  body.y += dist * Math.sin(angle)
}

export function contain(body, limit) {
  const l = limit - body.r
  if (body.x < -l) body.x = -l
  else if (body.x > l) body.x = l
  if (body.y < -l) body.y = -l
  else if (body.y > l) body.y = l
}
