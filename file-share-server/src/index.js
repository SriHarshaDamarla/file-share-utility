import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getCart } from "./store/cartStore.js";
import cartRouter from "./routes/cart.js";
import fileRouter from "./routes/files.js";
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

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.send(
    JSON.stringify({
      type: "FULLSNAP",
      data: getCart(),
    }),
  );
});

app.use("/", fileRouter);

app.use("/cart", cartRouter);
