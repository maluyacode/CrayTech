const dotenv = require("dotenv");
const dbConnect = require("./config/databaseConnection");
const app = require("./app");
const { Server } = require('socket.io');
const { sendMessage } = require("./Utils/notify");

dotenv.config({ path: "./config/.env" });
dbConnect();
require('./config/cloudinary');

const PORT = process.env.PORT || 4000;

const SERVER = app.listen(PORT, () =>
  console.log(`Server Started: http://localhost:${PORT}/`)
);



/// SOCKET

const io = new Server(SERVER, {
  cors: {
    origin: "*",
  }
});

const USERS = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("join", (data) => {
    const { userId } = data;
    USERS.set(userId, socket)
  });


  socket.on("send-message", (data) => {
    const { id } = data;
    const user = USERS.get(id);

    if (user) {
      user.emit('push-message', data)
    }

  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

})
