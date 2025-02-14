const net = require('net');
const g = require('./global')
const util = require('./util')

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
        //g.connections().push({ ndId: msg.ndId, ndNm: msg.ndNm, type: 'SERVER' })
        const now = new Date()
        g.connections()[msg.ndId] = { ndId: msg.ndId, ndNm: msg.ndNm, type: 'IM_SERVER', timestamp: now.getTime(), timestampStr: now.toISOString() }
        socket.write(JSON.stringify(util.createPingMsg())); // Respond to client
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

  // Listen on port 5000
server.listen(g.port(), () => {
    console.log(`Server listening on port ${g.port()}`);
  });