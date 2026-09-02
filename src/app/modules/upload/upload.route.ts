import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller.js";
import { checkAuth } from "../../middlewares/check-auth.js";
import { Role } from "../../constants/roles.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

// Mounted at /api/v1/upload
export const UploadRoutes = Router();

UploadRoutes.get("/", UploadController.cloudinaryHealthCheck);
UploadRoutes.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single("file"),
  UploadController.uploadFile
);

// Mounted at /api/v1/cloudinary
export const CloudinaryRoutes = Router();

CloudinaryRoutes.post(
  "/delete",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UploadController.deleteImage
);

// Mounted at /api/v1/upload-test
export const UploadTestRoutes = Router();

UploadTestRoutes.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UploadController.testUpload
);
