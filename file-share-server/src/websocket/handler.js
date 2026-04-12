import { WebSocketServer } from "ws";
import { getCart } from "../store/cartStore.js";
import {
  createSession,
  deleteSession,
  getSession,
} from "../store/sessionStore.js";

export let wss = null;

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.isAuthenticated = false;
    console.log("WebSocket client connected");
    ws.on("message", (data) => {
      const message = JSON.parse(data);
      if (message.type === "AUTH_REQUEST") {
        const sessionId = message.data.sessionId;
        processServerInitiation(ws, sessionId);
      } else if (!ws.isAuthenticated) {
        if (message.type === "JOIN_REQUEST") {
          sendClientJoinRequestToServers(ws, message.data.clientName);
        } else {
          ws.close();
        }
      } else {
        if (message.type === "JOIN_RESPONSE") {
          const { clientSessionId, serverSessionId, accepted } = message.data;
          processJoinResponse(clientSessionId, serverSessionId, accepted);
        }
      }
    });
  });
}

export function broadcast(message) {
  wss?.clients.forEach((client) => {
    if (client.readyState === 1 && client.isAuthenticated) {
      client.send(JSON.stringify(message));
    }
  });
}

function processServerInitiation(ws, sessionId) {
  if (getSession(sessionId, "server")) {
    ws.isAuthenticated = true;
    ws.sessionId = sessionId;
    ws.connectionType = "server";
    sendCartSnapshot(ws);
  } else {
    ws.close();
  }
}

function sendCartSnapshot(ws) {
  ws.send(
    JSON.stringify({
      type: "FULLSNAP",
      data: getCart(),
    }),
  );
}

function sendClientJoinRequestToServers(ws, clientName) {
  const clientSessionId = createSession(clientName, "client");
  ws.clientSessionId = clientSessionId;
  ws.connectionType = "client";
  let requestSent = false;
  wss?.clients.forEach((client) => {
    if (
      client.readyState === 1 &&
      client.isAuthenticated &&
      client.connectionType === "server"
    ) {
      client.send(
        JSON.stringify({
          type: "JOIN_REQUEST",
          data: {
            clientSessionId,
            clientName,
          },
        }),
      );
      requestSent = true;
    }
  });
  if (!requestSent) {
    ws.send(
      JSON.stringify({
        type: "JOIN_RESPONSE",
        data: {
          message: "No active server sessions",
          accepted: false,
        },
      }),
    );
    deleteSession(clientSessionId, "client");
    ws.close();
  }
}

function processJoinResponse(clientSessionId, serverSessionId, accepted) {
  getSession(serverSessionId, "server") &&
    wss?.clients.forEach((client) => {
      if (
        client.readyState === 1 &&
        client.connectionType === "client" &&
        client.clientSessionId === clientSessionId
      ) {
        client.send(
          JSON.stringify({
            type: "JOIN_RESPONSE",
            data: {
              serverSessionId,
              accepted,
            },
          }),
        );
        if (accepted) {
          sendCartSnapshot(client);
          client.isAuthenticated = true;
        } else {
          deleteSession(clientSessionId, "client");
          client.close();
        }
      } else if (
        client.readyState === 1 &&
        client.connectionType === "server" &&
        client.sessionId !== serverSessionId &&
        client.isAuthenticated
      ) {
        client.send(
          JSON.stringify({
            type: "JOIN_RESPONSE",
            data: {
              clientSessionId,
              serverSessionId,
              accepted,
            },
          }),
        );
      }
    });
}
