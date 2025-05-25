require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

const express=require("express");
const {connectToMongoDb}=require("./connect");
const cookieParser=require("cookie-parser");
const cors = require("cors");
const userRoute=require("./routes/userRoute");
const healthRoute = require("./routes/health");
const locationRoute=require('./routes/location');
const reminderRoute = require("./routes/remainder");
const bookingRoute = require("./routes/booking");
const sosRoutes = require('./routes/sosRoutes');
const trackingRoutes = require('./routes/tracking');
const uploadHealthPdfRoutes = require('./routes/HealthPdf');
const bluetoothRoutes = require('./routes/bluetooth');
const predictRiskRoute = require('./routes/riskPredict');
const emailroute=require('./routes/emailroute')
require('./tasks/reminderScheduler'); // 👈 ADD this line
require('./tasks/cleanupUnverifiedUsers')
const http = require('http');
const socketIo = require('socket.io');
const uploadMedical=require('./routes/uploadMedical');
const path = require('path');
const passwordRoute = require('./routes/password');



const app=express();
const PORT=process.env.PORT || 8001;

const server = http.createServer(app); // 👈 create server using http
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
io.on("connection", (socket) => {
   // console.log("A user connected");
  console.log(`User connected: ${socket.id}`);
  socket.on("registerUser", (userId) => {
    console.log(`🔐 Registering user ${userId} to room`);
    socket.join(userId.toString()); // Join user to a room named by their ID
    console.log(`Rooms for socket ${socket.id}:`, Array.from(socket.rooms));
  });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
     // console.log("User disconnected");
    });
  });
  // Make io accessible in routes
app.set("io", io);
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow frontend origin
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], 
}));

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("Connecting to MongoDB at:", process.env.MONGO_URI);

connectToMongoDb(process.env.MONGO_URI).then(()=>console.log("mongoDb Connected")) .catch((error) => console.error(error));
//console.log("mongoDb Connected after")
//console.log(sosRoutes);
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/userRoute",userRoute);
app.use("/health", healthRoute);
app.use("/location",locationRoute);
app.use("/reminder", reminderRoute);
app.use("/booking", bookingRoute);
app.use('/api', sosRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api', uploadHealthPdfRoutes);
app.use('/api/bluetooth', bluetoothRoutes);
app.use('/api', predictRiskRoute);
app.use('/api',emailroute);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', passwordRoute);

app.use('/api', uploadMedical); // where uploadHealthPdfRoutes handles /upload-medical and /user-uploads




server.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))