import { Router } from "express";

import { UploadController } from "./upload.controller";
import { imageUpload } from "./upload.config";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const uploadRoutes = Router();
const uploadController = new UploadController();

uploadRoutes.get("/images/:id", (request, response, next) => {
  return uploadController.showImage(request, response, next);
});

uploadRoutes.post(
  "/images",
  ensureAuthenticated,
  imageUpload.single("image"),
  (request, response, next) => {
    return uploadController.createImage(request, response, next);
  },
);

export { uploadRoutes };
