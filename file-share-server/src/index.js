import express from "express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import cors from "cors";
import { addToCart, getCart, removeFromCart } from "./cartStore.js";

const app = express();
dotenv.config();
const port = 3000;
const pathLib = path;

app.use(express.json());
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.send(
    JSON.stringify({
      type: "FULLSNAP",
      data: getCart(),
    }),
  );
});

app.get("/files", async (req, res) => {
  try {
    const reqPath = req.query.path || "";
    const basePath = process.env.BASE_FILE_PATH;
    const fullDirPath = pathLib.resolve(basePath, reqPath);

    if (!fullDirPath.startsWith(basePath)) {
      return res.status(403).send("Access denied");
    }

    const files = await fs.readdir(fullDirPath);

    const result = await Promise.all(
      files.map(async (file) => {
        const filePath = pathLib.join(fullDirPath, file);
        const stat = await fs.stat(filePath);

        return {
          name: file,
          type: stat.isDirectory() ? "folder" : "file",
        };
      }),
    );
    res.json(result);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).send("Error reading directory");
  }
});

app.get("/download", async (req, res) => {
  try {
    const reqPath = req.query.path;
    const basePath = process.env.BASE_FILE_PATH;
    const fullFilePath = pathLib.resolve(basePath, reqPath);

    if (!fullFilePath.startsWith(basePath)) {
      return res.status(403).send("Access denied");
    }
    const stat = await fs.stat(fullFilePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {
      const start = Number(range.replace(/\D/g, ""));
      const end = fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = fsSync.createReadStream(fullFilePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "application/octet-stream",
      });
      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${pathLib.basename(fullFilePath)}"`,
      });
      fsSync.createReadStream(fullFilePath).pipe(res);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Error downloading file");
  }
});

app.post("/cart/add", (req, res) => {
  const file = req.body;

  const result = addToCart(file);

  if (result.added) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: "ADDFILE",
            data: result.file,
          }),
        );
      }
    });
  }

  res.json(result);
});

app.post("/cart/remove", (req, res) => {
  const { path } = req.body;

  const result = removeFromCart(path);

  if (result.removed) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: "REMOVEFILE",
            data: { path },
          }),
        );
      }
    });
  }

  res.json(result);
});
