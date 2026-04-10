import { WebSocketServer } from "ws";
import { getCart } from "../store/cartStore";

export let wss = null;

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.send(
      JSON.stringify({
        type: "FULLSNAP",
        data: getCart(),
      }),
    );
  });
}

export function broadcast(message) {
  wss?.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
