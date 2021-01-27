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
var animals = ['🐪','🐫','🦙','🦘','🦥','🦨','🐘','🐁','🦔','🐇','🐿','🦎','🐊','🐢','🐍','🐐','🐑','🐏','🐖','🐄','🐃','🐂','🦛','🦏','🦌','🐎','🐆','🐅,','🐈','🐕','🐩','🐕‍🦺','🦮','🦧','🦍','🐒,','🐉','🦕','🦖','🦦','🦈','🐬','🐳','🐋','🐟','🐠','🐡','🦐','🦑','🐙','🦞','🦀','🦆','🐓','🦃','🦅','🦢','🦜','🦩','🦚','🦉','🐧','🦇','🦋','🐌','🐛','🐝','🐞','🦂','🕷'];
var messageObjects = [];

// =============== sockets transactions ==================
io.on("connection", socket => {
  console.log('A client connected: ', socket.id);

    socket.on('join_room', (data) => {
      // server gets data.userName and data.room
      socket.join(data.room);
      console.log(`${data.userName} joined room:`, data.room)
      // give that user all the data of that room if it exits ???
      // socket.emit('server says - heres your data', messageObjects)


      // add new user to server userObjects array
      if (!userObjects.includes(socket.id)) {
        userObjects.push({
          socket_id: socket.id,
          userName: data.userName,
          room: data.room
        })
      }

      // give new user all chat data if in same room

    })




  // user joins for first time!
  socket.on("CLIENT -> server - gimme data!", got_data => {
    socket.emit('server says - heres your data', messageObjects)
  })

    
    
    // server listens for this event
    socket.on("event-from-client", data => {
    const {room, content: {userName, newMessage} } = data;

    console.log('\n===========')
    console.log(room, userName, newMessage)
    console.log('\n===========')

    // timestamp
    var d = new Date();
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    console.log(`${h}:${m}:${s}`)
    
    messageObjects.push({
      room: data.room,
      userName: data.content.userName,
      message: data.content.newMessage,
      client_id: socket.id,
      dateSent : {
        h,m,s
      }
    })

    console.log('messageObjects = ', messageObjects)

    let newMsgToSendToClient = {
      userName: data.content.userName,
      message: data.content.newMessage,
      client_id: socket.id,
      dateSent : {
        h,m,s
      }
    }
    
    // !!!! SEND MESSAGES SPECIFICALLY TO A ROOM!!!!!
    console.log('about to send new messages back')
    io.to(data.room).emit('receive_message', newMsgToSendToClient)
    console.log('dinished sending new messages back')
    })
    
    socket.on('disconnect', ()=> {
      console.log('USER DISCONNECTED')
    })

  })
  // ----- END socket transactions -----
  

