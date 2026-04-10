import { WebSocketServer } from "ws";

export let wss = null;

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });
}

export function broadcast(message) {
  wss?.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
