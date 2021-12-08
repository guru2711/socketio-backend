const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const userRoute = require("./routes/user")
const loginRoute = require("./routes/login")
const UserModel = require("./models/User")
const auth = require("./middleware/auth")
 
app.use(cors());
app.use(express.json())
connectDB()

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.get("/",auth, async (req,res) => {
 
  res.send("user")
})

// connect
io.on("connection", (socket) => {
console.log(`User connected: ${socket.id}`)

// join room
socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_msg", data);
console.log(data)
  })


// disconnect
socket.on("disconnect", () => {
    console.log("user Disconnected", socket.id)
})
})


app.use("/api", userRoute)
app.use("/api", loginRoute)

server.listen(process.env.PORT || 3001, () => {
    console.log("Server is running")
})