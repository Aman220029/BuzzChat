import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import userRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "../src/lib/socket.js";
import path from "path";

dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/messages", messageRoute);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
    connectDB();
})