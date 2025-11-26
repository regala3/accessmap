// linked libraries
import express, { application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//imports from other files
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import eventRoutes from "./routes/event.route.js";
import { app, server } from "./lib/socket.js";


dotenv.config();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173', // development
  'https://accessiblemap.org', //Production
  'https://www.accessiblemap.org' // production with www
];

const corsOption = {
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOption));

console.log(FRONTEND_URL);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/events", eventRoutes); 

server.listen(PORT, () => {
  console.log("server is running on:" + PORT);
  connectDB();
});
