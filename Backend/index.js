const express=require("express");
const {connectToMongoDb}=require("./connect");
const cookieParser=require("cookie-parser");
const cors = require("cors");
const userRoute=require("./routes/userRoute")
const healthRoute = require("./routes/health");
const locationRoute=require('./routes/location');
const reminderRoute = require("./routes/remainder");
const bookingRoute = require("./routes/booking");
require('./tasks/reminderScheduler'); // 👈 ADD this line
const http = require('http');
const socketIo = require('socket.io');

const app=express();
const PORT=8001;

const server = http.createServer(app); // 👈 create server using http
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
io.on("connection", (socket) => {
    console.log("A user connected");
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  // Make io accessible in routes
app.set("io", io);
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], 
}));
connectToMongoDb("mongodb://127.0.0.1:27017/jeevaFit").then(()=>console.log("mongoDb Connected")) .catch((error) => console.error(error));
console.log("mongoDb Connected after")

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/userRoute",userRoute);
app.use("/health", healthRoute);
app.use("/location",locationRoute);
app.use("/reminder", reminderRoute);
app.use("/booking", bookingRoute);

server.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))