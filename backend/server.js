const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let roomIDGlobal, imageURLGlobal;

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("A client connected");
  // Handle WebSocket events here
  socket.on("userJoined", (data) => {
    const { name, userID, roomID, host, presenter } = data;
    roomIDGlobal = roomID;
    socket.join(roomID);
    const users = addUser({
      name,
      userID,
      roomID,
      host,
      presenter,
      socketID: socket.id,
    });

    socket.emit("userIsJoined", { success: true, users });

    socket.broadcast.to(roomID).emit("joinedUser", users);

    socket.broadcast.to(roomID).emit("whiteboardDataResponce", {
      imgURL: imageURLGlobal,
    });

    socket.broadcast.to(roomID).emit("userJoinedMessage", users);
  });

  socket.on("whiteboardData", (data) => {
    imageURLGlobal = data;
    socket.broadcast.to(roomIDGlobal).emit("whiteboardDataResponce", {
      imgURL: data,
    });
  });

  socket.on("message", (data) => {
    const { message,time } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(roomIDGlobal)
        .emit("messageResponse", { message:message, time:time, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    let user = removeUser(socket.id);
    if (!user) return;

    let users = getUsersInRoom(user.roomID)

    socket.to(user.roomID).emit("leftUser", user);
    socket.broadcast.to(user.roomID).emit("userLeftMessage", user);
    if (users.length == 0) {
      console.log(users, "users");
      io.sockets.in(user.roomID).emit("emptyRoom");
    }
  });

  socket.on("userIsLeft", () => {
    console.log("userHasLeftedTheRoom");
    socket.emit("userLeftEvent");
  })
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
