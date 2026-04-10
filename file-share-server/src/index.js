import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cartRouter from "./routes/cart.js";
import fileRouter from "./routes/files.js";
import authRouter from "./routes/auth.js";
import { initWebSocketServer, wss } from "./websocket/handler.js";

const app = express();
dotenv.config();
const port = 3000;

app.use(express.json());
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

initWebSocketServer(server);

app.use("/", fileRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);
