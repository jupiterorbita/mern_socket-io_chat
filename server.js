// io.emit emits an event to all connected clients
// socket.broadcast.emit emits an event to all clients other than this particular one, referenced by the socket variable
// socket.emit emits an event directly to this specific client
const express = require('express');
const app = express();
const PORT = 1337

const server = app.listen(PORT, ()=> {
  console.log(`>> server on port: ${PORT} <<`);
});



const sockets = require("socket.io");
const io = sockets(server, {cors: true});

var userObjects = []

var animals = [
  '🐪','🐫','🦙','🦘','🦥','🦨','🐘','🐁','🦔','🐇','🐿','🦎','🐊','🐢','🐍','🐐','🐑','🐏','🐖','🐄','🐃','🐂','🦛','🦏','🦌','🐎','🐆','🐅,','🐈','🐕','🐩','🐕‍🦺','🦮','🦧','🦍','🐒,','🐉','🦕','🦖','🦦','🦈','🐬','🐳','🐋','🐟','🐠','🐡','🦐','🦑','🐙','🦞','🦀','🦆','🐓','🦃','🦅','🦢','🦜','🦩','🦚','🦉','🐧','🦇','🦋','🐌','🐛','🐝','🐞','🦂','🕷'
]
var messageObjects = [];


// ----- sockets transactions -----
io.on("connection", socket => {
  console.log('A client connected: ', socket.id);

  if (!userObjects.includes(socket.id)) {
    userObjects.push(socket.id)
    io.emit("server-sends-new-user-event", {user_id : socket.id})

  }

    
    
  
    
    
    
    

    // server listens for this event
    socket.on("event-from-client", data => {
    console.log(socket.id, ' said: ', data.message)

    // calc time stamp
    var d = new Date();
    var n = d.getTime();
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    console.log(`${h}:${m}:${s}`)
    


    messageObjects.push({
      message: data.message,
      client_id: socket.id,
      dateSent : {
        h,m,s
      }
    })
    

    console.log(messageObjects)
    
    
    
    
    // server responds with this event
    io.emit("server-sends-data-to-all-clients", messageObjects)
    // io.emit("server-sends-data-to-all-clients", {
      //   message: data.message, 
      //   socket_id: socket.id,
      //   time: {h,m,s}
      // })
    })
    

  })
  // ----- END socket transactions -----
  

