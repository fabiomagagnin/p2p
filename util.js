const g = require('./global')

function createPingMsg() {
  const msg = {
    ndNm: g.name(),
    ndId: g.id(),
    //msg: `Ping ${counter++}`,
    type: 'PING'
  }
  return msg
}

module.exports = { createPingMsg }