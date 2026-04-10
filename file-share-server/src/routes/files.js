import { Router } from "express";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { requireClientAuth, requireHostAuth } from "../middleware/auth.js";

const router = Router();
const pathLib = path;

router.get("/files", requireHostAuth, async (req, res) => {
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

router.get("/download", requireClientAuth, async (req, res) => {
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

export default router;
