import http from 'http'
import path from 'path'
import WebSocket from 'ws'
import __dirname from './dirname.js'
import fileServer from './server/file-server.mjs'
import { Game } from './public/game/game.mjs'
import Tick from './public/game/tick.mjs'
import Id from './public/game/id.mjs'

import perf_hooks from 'perf_hooks'
global.performance = perf_hooks.performance

const PORT = process.env.PORT || 3000
const SNAP_INTERVAL = 1000
const MAX_PING = 300
const ALLOWED_EVENTS = new Set(['join', 'input', 'ping'])
const PUB_DIR = path.join(__dirname, 'public')

const game = new Game(true, 1000)
const server = http.createServer(fileServer(PUB_DIR))
const wss = new WebSocket.Server({ server })
const stop = Tick(16, update, render)

wss.on('connection', onConnect)
server.listen(PORT, onListening)

function onConnect(client) {
  Object.assign(client, { id: Id(), ping: 0, snapTime: 0, snapId: '' })
  console.log(client.id, 'connected')
  welcome(client)
  client.on('message', str => {
    try {
      const msg = JSON.parse(str)
      if (msg.type === 'action' && isValid(client, msg.action)) {
        const time = performance.now() - client.ping
        const index = game.commit(msg.action, time)
        const snap = game.reduce(true, index + 1)
        reply(client, snap, msg.action.id)
        relay(client, msg.action)
      }
      else if (msg.type === 'ok' && msg.snapshot === client.snapId) {
        const roundtrip = performance.now() - client.snapTime
        client.ping = Math.max(0, Math.min(roundtrip / 2, MAX_PING))
      }
    } catch (err) {
      console.log(err)
    }
  })
  client.on('close', () => {
    const la = game.leaveAction(client.id)
    game.commit(la, performance.now())
    relay(client, la)
  })
}

function update(ms, time) {
  game.commit(game.tickAction(ms), performance.now())
}

function render(ms, time) {

}

function isValid(client, action) {
  return action.source === client.id && ALLOWED_EVENTS.has(action.name)
}

function onListening() {
  console.log(`Server running on ${PORT}`)
}

function welcome(client) {
  const str = JSON.stringify({ type: 'welcome', id: client.id })
  client.send(str)
}

function reply(client, snapshot, actionId) {
  const now = performance.now()
  if (now < client.snapTime + SNAP_INTERVAL) return
  const str = JSON.stringify({ type: 'snapshot', snapshot, actionId })
  client.send(str)
  client.snapTime = now
  client.snapId = snapshot.id
}

function relay(source, action) {
  wss.clients.forEach(client => {
    if (client !== source && client.readyState === WebSocket.OPEN) {
      const str = JSON.stringify({ type: 'action', action, delay: source.ping + client.ping })
      client.send(str)
    }
  })
}