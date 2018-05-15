import http from 'http'
import fs from 'fs'
import path from 'path'
import util from 'util'
import url from 'url'
import __dirname from './dirname.js'

const promisify = util.promisify
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  const filepath = pathFrom(req.url, 'public', '/client.html')
  if (!filepath) {
    res.statusCode = 404
    res.end('404')
    return
  }
  const mimes = { '.html': 'text/html', '.mjs': 'text/javascript' }
  const ext = path.parse(filepath).ext
  const rs = fs.createReadStream(filepath)
  rs.on('error', err => {
    res.statusCode = 500
    res.end(`Error: ${err}`)
  })
  res.setHeader('Content-type', mimes[ext] || 'text/plain')
  rs.pipe(res)
})

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

function pathFrom(str, pub, root) {
  const parsed = url.parse(str)
  const pathname = parsed.pathname === '/' ? root : parsed.pathname
  const filepath = path.join(__dirname, pub, pathname)
  if (!filepath.startsWith(path.join(__dirname, pub))) {
    return undefined
  }
  return filepath
}