import { getSession } from "../store/sessionStore.js";

export function requireHostAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  processAuth(req, res, next, token, "server");
}

export function requireClientAuth(req, res, next) {
  const token = req.query.token;
  processAuth(req, res, next, token, "client");
}

function processAuth(req, res, next, token, type) {
  const sessionUser = getSession(token, type);
  if (!sessionUser) {
    return res.status(401).send("Unauthorized");
  }
  req.user = sessionUser;
  next();
}
