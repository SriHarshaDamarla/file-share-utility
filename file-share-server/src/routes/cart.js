import { Router } from "express";
import { addToCart, removeFromCart } from "../store/cartStore.js";
import { broadcast } from "../websocket/handler.js";
import { requireHostAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireHostAuth);

router.post("/add", (req, res) => {
  const file = req.body;

  const result = addToCart(file);

  if (result.added) {
    broadcast({
      type: "ADDFILE",
      data: result.file,
    });
  }

  res.json(result);
});

router.post("/remove", (req, res) => {
  const { path } = req.body;

  const result = removeFromCart(path);

  if (result.removed) {
    broadcast({
      type: "REMOVEFILE",
      data: { path },
    });
  }

  res.json(result);
});

export default router;
