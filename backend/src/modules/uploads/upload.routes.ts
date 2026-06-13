import { Router } from "express";

import { UploadController } from "./upload.controller";
import { imageUpload } from "./upload.config";

const uploadRoutes = Router();
const uploadController = new UploadController();

uploadRoutes.post(
  "/images",
  imageUpload.single("image"),
  (request, response, next) => {
    return uploadController.createImage(request, response, next);
  },
);

export { uploadRoutes };
