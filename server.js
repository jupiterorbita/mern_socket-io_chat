// io.emit emits an event to all connected clients
// socket.broadcast.emit emits an event to all clients other than this particular one, referenced by the socket variable
// socket.emit emits an event directly to this specific client
const express = require("express");
const app = express();
const PORT = 1337;

const server = app.listen(PORT, () => {
  console.log(`>> server on port: ${PORT} <<`);
});

const sockets = require("socket.io");
const io = sockets(server, { cors: true });

var userObjects = [];
var animals = [
  "🐪",
  "🐫",
  "🦙",
  "🦘",
  "🦥",
  "🦨",
  "🐘",
  "🐁",
  "🦔",
  "🐇",
  "🐿",
  "🦎",
  "🐊",
  "🐢",
  "🐍",
  "🐐",
  "🐑",
  "🐏",
  "🐖",
  "🐄",
  "🐃",
  "🐂",
  "🦛",
  "🦏",
  "🦌",
  "🐎",
  "🐆",
  "🐅",
  "🐈",
  "🐩",
  "🐕‍🦺",
  "🦮",
  "🦧",
  "🦍",
  "🐒",
  "🐉",
  "🦕",
  "🦖",
  "🦦",
  "🦈",
  "🐬",
  "🐳",
  "🐋",
  "🦆",
  "🐓",
  "🦃",
  "🦅",
  "🦢",
  "🦜",
  "🦩",
  "🦚",
  "🦉",
  "🐧",
  "🦇",
  "🦋",
  "🐌",
  "🐛",
  "🐝",
  "🐞",
  "🦂",
  "🕷",
];
var messageObjects = [];

// timestamp
const getTimestamp = () => {
  var d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return `${h}:${m}:${s}`;
};

const newEmoji = () => {
  let animalArrLength = animals.length;
  let randIdx = Math.floor(Math.random() * animalArrLength);
  let thisNewUserEmoji = animals[randIdx];
  console.log(thisNewUserEmoji);
  return thisNewUserEmoji;
};

// =============== sockets transactions ==================
io.on("connection", (socket) => {
  console.log("A client connected: ", socket.id);

  socket.on("join_room", ({ room, userName }) => {
    // save new user
    const user = {
      id: socket.id,
      userName: userName,
      room: room,
      emoji: newEmoji(),
    };
    console.log("user", user);
    // push to users array of obj
    userObjects.push(user);

    // make user join their room
    socket.join(user.room);
    console.log(`${user.userName} joined room:`, user.room);

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message_from_server", {
      message: `${user.userName} has joined the Jungle`,
      dateSent: getTimestamp(),
    });

    // socket.emit('server says - heres your data', messageObjects)
    // give to new user all data from same room
    if (messageObjects.filter((s) => s.room === room)) {
      // return that rooms messages:
      const findThatRoomsMsgs = (room) => messageObjects.filter((s) => s.room === room);
      console.log("🔎🔎 findThatRoomsMsgs() -> ", findThatRoomsMsgs);
      const giveNewUserRoomMessages = findThatRoomsMsgs(user.room);
      console.log("🎈🎈🎈 giveNewUserRoomMessages", giveNewUserRoomMessages);

      io.to(user.room).emit("server says - heres your data", giveNewUserRoomMessages);
    }

    // send users and room info:
    const getRoomUsers = (room) => userObjects.filter((user) => user.room === room);
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // server listens for this event
  socket.on("event-from-client", ({ room, content: { userName, newMessage } }) => {
    const findUserEmoji = (userName) => {
      let userEmoji = userObjects.find((o) => o.userName === userName).emoji;
      return userEmoji;
    };

    // server messages ALL
    messageObjects.push({
      room: room,
      userName: userName,
      message: newMessage,
      client_id: socket.id,
      emoji: findUserEmoji(userName),
      dateSent: getTimestamp(),
    });

    // client specific messages
    let newMsgToSendToClient = {
      userName: userName,
      message: newMessage,
      client_id: socket.id,
      emoji: findUserEmoji(userName),
      dateSent: getTimestamp(),
    };

    // !!!! SEND MESSAGES SPECIFICALLY TO A ROOM!!!!!
    io.to(room).emit("receive_message", newMsgToSendToClient);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED", socket.id);

    // send user that disconnect :
    const userLeave = (id) => {
      const index = userObjects.findIndex((user) => user.id === id);
      if (index !== -1) {
        return userObjects.splice(index, 1)[0];
      }
    };

    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("disconnected_user", { user: user.userName, dateSent: getTimestamp(), emoji: user.emoji });

      // send users and room info:
      const getRoomUsers = (room) => userObjects.filter((user) => user.room === room);
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
// ----- END socket transactions -----
