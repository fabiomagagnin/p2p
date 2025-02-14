const { v4: uuidv4 } = require('uuid');

const nodeConnections = {}
let nodeId = null
let nodeName = null
let nodePort = null
let nodePeers = []

try {
    nodeId = uuidv4()
    nodeName = process.argv[2]
    nodePort = Number(process.argv[3])
    const peersStr = process.argv[4]
    if (peersStr) {
      const peersArr = peersStr.split(',')
      for (const peer of peersArr)
        nodePeers.push({host: peer.split(':')[0], port: peer.split(':')[1]})
    }
  } catch (err) {
    console.log(err)
  }

  const id = () => {
    return nodeId
  }

  const name = () => {
    return nodeName
  }

  const port = () => {
    return nodePort
  }

  const peers = () => {
    return nodePeers
  }

  const connections = () => {
    return nodeConnections
  }

  module.exports = {
    id, name, port, peers, connections
  }