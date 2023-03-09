const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const path = require("path");
const socket = require("socket.io");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3001;
const publicChatRoom = process.env.PUBLIC_CHAT_ROOM;
global.Services = path.resolve("./api/v1/Controllers/Services");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_Password);
const mongoose_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose
  .connect(DB, mongoose_options)
  .then(() => console.log("DB connection successfully made"));

const server = http.createServer(app);
console.log(process.env.DB_Password, publicChatRoom, "news");
const running_server = server.listen(port, () => {
  console.log(`Node application is running on port ${port}`);
});

const io = socket(running_server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
});
//store all online users inside this map
const users = [];

// const addUser = ({ name, id, room }) => {
//   name = name.trim().toLowerCase();
//   room = room.trim().toLowerCase();

//   const index = users.findIndex((user) => id === user.id && room === user.room);

//   const user = { name, id, room };
//   if (index === -1) {
//     users.push(user);
//   }

//   return { user };
// };

// const getUser = (id) => users.find((user) => id === user.id);
// const getUsersInRoom = (room) => users.filter((user) => room === user.room);

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("join", ({ name, room, id }, callback) => {
//     const { user, error } = addUser({
//       id: id ? id : socket.id,
//       name,
//       room,
//     });

//     if (error) return callback(error);

//     io.to(user.id).emit("getCurrent", user);

//     socket.join(user.room);

//     io.to(user.room).emit("roomData", {
//       room: user.room,
//       users: getUsersInRoom(user.room),
//     });

//     callback(user);
//   });

//   socket.on("sendMessage", (data, callback) => {
//     const user = getUser(data.id);
//     if (user) {
//       io.to(user.room).emit("message", {
//         id: user.id,
//         createdAt: new Date(),
//         name: user.name,
//         message: data.message,
//       });
//       io.to(user.room).emit("roomData", {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });
//     }
//     callback();
//   });
// });

io.on("connection", function (socket) {
  console.log(`A client connected:`);
  console.log(`Someone is recently join public chat group`);
  socket.on("join_room", function (room) {
    console.log("joined_room");
    socket.join(room);
   
  });
  socket.on(publicChatRoom, (data, callback) => {
    console.log(data, "someone message in public chat group");
    io.sockets
      .in(publicChatRoom)
      .emit(publicChatRoom, { message: data.message,createdAt:new Date() });
    // const user = getUser(data.id);
    // if (user) {
    //   io.to(user.room).emit("message", {
    //     id: user.id,
    //     createdAt: new Date(),
    //     name: user.name,
    //     message: data.message,
    //   });
    //   io.to(user.room).emit("roomData", {
    //     room: user.room,
    //     users: getUsersInRoom(user.room),
    //   });
    // }
    // callback();
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhadles Rejection", err);
  running_server.close(() => {
    process.exit(1);
  });
});
