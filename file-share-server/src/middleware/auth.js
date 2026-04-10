import { getSession } from "../store/sessionStore";

export function requireHostAuth(req, res, next) {
  processAuth(req, res, next, "server");
}

export function requireClientAuth(req, res, next) {
  processAuth(req, res, next, "client");
}

function processAuth(req, res, next, type) {
  const token = req.headers.authorization?.split(" ")[1];
  const sessionUser = getSession(token, type);

  if (!sessionUser) {
    return res.status(401).send("Unauthorized");
  }

  req.user = sessionUser;
  next();
}
