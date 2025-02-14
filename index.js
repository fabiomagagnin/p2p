const g = require('./global')
const server = require('./server')
const client = require('./client')

// msg contract:
// {
//   ndId,
//   ndNm,
//   type,
//   msg,
// }

// node index.js MONZA 5000
// node index.js CHEVETE 5001 localhost:5000
// node index.js MAVERIK 5002 localhost:5000,localhost:5001
// node index.js OPALA 5003 localhost:5000,localhost:5001,localhost:5002

setInterval(() => {
  const now = new Date()
  console.log('------', g.name(), '------')
  for (const id in g.connections()) {
    const connection = g.connections()[id]
    let removed = false
    if (now.getTime() - connection.timestamp > 5000) {
      delete g.connections()[id]
      removed = true
    }
    console.log(`${connection.ndNm} - ${connection.type}${removed ? ' - REMOVED' : ''}`)

  }
}, 5000)
