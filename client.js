const net = require('net');
const g = require('./global')
const util = require('./util')

if (g.peers().length > 0) {

    for (const peer of g.peers()) {
      // Connect to the server
      let client = net.createConnection({ port: peer.port, host: peer.host }, () => {
        console.log('Connected to server', peer.host, peer.port);
  
        client.on('error', (err) => {
          console.log('lost connection with server')
        })
  
        client.on('data', (data) => {
          let msgStr = data.toString()
          let msg = JSON.parse(msgStr)
          // Client receiving PING back from server
          if (msg.type === 'PING') {
            const now = new Date()
            g.connections()[msg.ndId] = { ndId: msg.ndId, ndNm: msg.ndNm, type: 'IM_CLIENT', timestamp: now.getTime(), timestampStr: now.toISOString() }
          }
        })
  
        setInterval(() => {
          client.write(JSON.stringify(util.createPingMsg())); // Send message to server
        }, 3000)
      });
    }
  
  } else {
    console.log('NO PEERS TO CONNECT')
  }