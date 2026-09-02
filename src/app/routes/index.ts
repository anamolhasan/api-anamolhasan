import { Router } from "express";
import { ProjectRoutes } from "../modules/project/project.route.js";
import {
  UploadRoutes,
  CloudinaryRoutes,
  UploadTestRoutes,
} from "../modules/upload/upload.route.js";

const router = Router();

router.use("/projects", ProjectRoutes);
router.use("/upload", UploadRoutes);
router.use("/cloudinary", CloudinaryRoutes);
router.use("/upload-test", UploadTestRoutes);

export const ApiRoutes = router;
