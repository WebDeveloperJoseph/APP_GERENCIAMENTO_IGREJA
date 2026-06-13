import multer from "multer";

import { AppError } from "../../errors/AppError";

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export const imageUpload = multer({
  storage: multer.memoryStorage(),
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
