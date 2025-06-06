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
const axios = require('axios');



const app=express();
const PORT=process.env.PORT || 8001;

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());



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
app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow frontend origin
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"] ,
}));
// Preflight handler

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("Connecting to MongoDB at:", process.env.MONGO_URI);

connectToMongoDb(process.env.MONGO_URI).then(()=>console.log("mongoDb Connected")) .catch((error) => console.error(error));
//console.log("mongoDb Connected after")
//console.log(sosRoutes);
app.use((req, res, next) => {
  console.log(`[GLOBAL LOGGER] ${req.method} ${req.url}`);
  next();
});

// Proxy endpoint
app.get('/api/healthtopics', async (req, res) => {
  try {
    const { db, term, rettype, retmax } = req.query;

    // Validate required query params
    if (!db || !term || !rettype || !retmax) {
      return res.status(400).json({
        error: {
          code: 400,
          type: "BadRequest",
          message: "Missing one or more required query parameters: db, term, rettype, retmax"
        }
      });
    }

    const url = `https://wsearch.nlm.nih.gov/ws/query?db=${encodeURIComponent(db)}&term=${encodeURIComponent(term)}&rettype=${encodeURIComponent(rettype)}&retmax=${encodeURIComponent(retmax)}`;
    const response = await axios.get(url);

    // Forward the response
    res.set('Content-Type', response.headers['content-type']);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);

    // If error is from Axios and a response was received
    if (error.response) {
      res.status(error.response.status).json({
        error: {
          code: error.response.status,
          type: "UpstreamAPIError",
          message: "Error returned from external NIH API.",
          details: {
            statusText: error.response.statusText,
            responseData: error.response.data
          }
        }
      });
    }
    // If no response was received (e.g., network issue)
    else if (error.request) {
      res.status(502).json({
        error: {
          code: 502,
          type: "BadGateway",
          message: "No response received from NIH API.",
          details: {
            request: error.request._currentUrl || "Unknown request URL"
          }
        }
      });
    }
    // Other errors (code bugs, config issues)
    else {
      res.status(500).json({
        error: {
          code: 500,
          type: "InternalServerError",
          message: "An unexpected error occurred while proxying the request.",
          details: {
            errorMessage: error.message,
            stack: error.stack
          }
        }
      });
    }
  }
});

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