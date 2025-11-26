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

//const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/events", eventRoutes); 

server.listen(FRONTEND_URL, () => {
  console.log("server is running on:" + FRONTEND_URL);
  connectDB();
});
