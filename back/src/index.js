const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const socketEvents = require("./utils/socket")
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
socketEvents(io)

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes(io));
app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
