import { Router } from "express";
import { createSession, deleteSession } from "../store/sessionStore.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.HOST_USERNAME &&
    password === process.env.HOST_PASSWORD
  ) {
    const sessionId = createSession(username, "server");
    res.json({ sessionId });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

router.post("/logout", (req, res) => {
  const sessionId = req.headers.authorization?.split(" ")[1];
  if (sessionId) {
    deleteSession(sessionId, "server");
  }
  res.status(200).send("Logged out successfully");
});

export default router;
