// server.js
const net = require('net');
const { v4: uuidv4 } = require('uuid');
const connections = {}
let nodeId = null
let nodeName = null
let nodePort = null
let peers = []

// msg contract:
// {
//   ndId,
//   ndNm,
//   type,
//   msg,
// }

function createPingMsg() {
  const msg = {
    ndNm: nodeName,
    ndId: nodeId,
    //msg: `Ping ${counter++}`,
    type: 'PING'
  }
  return msg
}

try {
  nodeId = uuidv4()
  nodeName = process.argv[2]
  nodePort = Number(process.argv[3])
  const peersStr = process.argv[4]
  if (peersStr) {
    const peersArr = peersStr.split(',')
    for (const peer of peersArr)
      peers.push({host: peer.split(':')[0], port: peer.split(':')[1]})
  } else {
    console.log('NO PEERS TO CONNECT')
  }
} catch (err) {
  console.log(err)
}

// node index.js MONZA 5000
// node index.js CHEVETE 5001 localhost:5000
// node index.js MAVERIK 5002 localhost:5000,localhost:5001


// Create a TCP server
const server = net.createServer((socket) => {
  //console.log('Client connected');

  // Handle incoming data
  socket.on('data', (data) => {
    //console.log('DATA', data.toString())
    let msgStr = data.toString()
    let msg = JSON.parse(msgStr)

    // Server receiving ping from client
    if (msg.type === 'PING') {
      //connections.push({ ndId: msg.ndId, ndNm: msg.ndNm, type: 'SERVER' })
      const now = new Date()
      connections[msg.ndId] = { ndId: msg.ndId, ndNm: msg.ndNm, type: 'IM_SERVER', timestamp: now.getTime(), timestampStr: now.toISOString() }
      socket.write(JSON.stringify(createPingMsg())); // Respond to client
    }
    // console.log('Received from client:', `[${msg.ndNm.padStart(10, ' ')}] ${msg.msg}`);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.log('Error', err)
  })

});

if (peers) {

  for (const peer of peers) {
    // Connect to the server
    let client = net.createConnection({ port: peer.port, host: peer.host }, () => {

      //connections.push({ ndId: null, ndNm: null, type: 'CLIENT', client, peer: `${peer.host}:${peer.port}` })
      //connections[nodeId] = { ndId: nodeId, ndNm: null, type: 'CLIENT', client, peer: `${peer.host}:${peer.port}` }

      console.log('Connected to server', peer.host, peer.port);

      client.on('error', (err) => {
        console.log('lost connection with server')
      })

      client.on('data', (data) => {
        let msgStr = data.toString()
        let msg = JSON.parse(msgStr)
        // Client receiving PING back from server
        if (msg.type === 'PING') {
          //connections.push({ ndId: msg.ndId, ndNm: msg.ndNm, type: 'SERVER' })
          const now = new Date()
          connections[msg.ndId] = { ndId: msg.ndId, ndNm: msg.ndNm, type: 'IM_CLIENT', timestamp: now.getTime(), timestampStr: now.toISOString() }
          // console.log(nodeName, 'received PING BACK')
        }
      })

      setInterval(() => {
        // const msg = {
        //   ndNm: nodeName,
        //   ndId: nodeId,
        //   //msg: `Ping ${counter++}`,
        //   type: 'PING'
        // }
        //console.log('Connected to server');
        client.write(JSON.stringify(createPingMsg())); // Send message to server
      }, 3000)
    });
  }

}



// Listen on port 5000
server.listen(nodePort, () => {
  console.log(`Server listening on port ${nodePort}`);
});


setInterval(() => {
  const now = new Date()
  console.log('------', nodeName, '------')
  for (const id in connections) {
    const connection = connections[id]
    let removed = false
    if (now.getTime() - connection.timestamp > 5000) {
      delete connections[id]
      removed = true
    }
    console.log(`${connection.ndNm} - ${connection.type}${removed ? ' - REMOVED' : ''}`)

  }
}, 5000)
