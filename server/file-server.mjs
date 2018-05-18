import fs from 'fs'
import path from 'path'
import url from 'url'

export default function fileServer(dir) {
  return (req, res) => {
    const filepath = pathFrom(req.url, dir, '/index.html')
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
  }
}

function pathFrom(str, dir, root) {
  const parsed = url.parse(str)
  const pathname = parsed.pathname === '/' ? root : parsed.pathname
  const filepath = path.join(dir, pathname)
  if (!filepath.startsWith(dir)) {
    return undefined
  }
  return filepath
}
