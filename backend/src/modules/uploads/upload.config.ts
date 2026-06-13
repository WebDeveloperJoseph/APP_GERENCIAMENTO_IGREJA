import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

import { AppError } from "../../errors/AppError";

export const uploadsDirectory = path.resolve(process.cwd(), "uploads");
const imagesDirectory = path.join(uploadsDirectory, "images");

fs.mkdirSync(imagesDirectory, { recursive: true });

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: imagesDirectory,
    filename: (_request, file, callback) => {
      const extension = allowedMimeTypes.get(file.mimetype) || ".jpg";
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError(
          "Formato de imagem invalido. Use JPG, PNG ou WEBP.",
          400,
        ),
      );
      return;
    }

    callback(null, true);
  },
});
