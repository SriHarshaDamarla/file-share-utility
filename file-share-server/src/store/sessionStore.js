const hostSessions = new Map();
const clientSessions = new Map();

export function createSession(username, type) {
  const sessionId = generateSessionId();
  if (type === "server") {
    hostSessions.set(sessionId, username);
  } else if (type === "client") {
    clientSessions.set(sessionId, username);
  }
  return sessionId;
}

export function getSession(sessionId, type) {
  if (type === "server") {
    return hostSessions.get(sessionId);
  } else if (type === "client") {
    return clientSessions.get(sessionId);
  }
  return undefined;
}

export function deleteSession(sessionId, type) {
  if (type === "server") {
    hostSessions.delete(sessionId);
  } else if (type === "client") {
    clientSessions.delete(sessionId);
  }
}

function generateSessionId() {
  return crypto.randomUUID();
}
