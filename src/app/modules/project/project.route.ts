import { Router } from "express";
import { ProjectController } from "./project.controller.js";
import { checkAuth } from "../../middlewares/check-auth.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { ProjectValidation } from "./project.validation.js";
import { Role } from "../../constants/roles.js";

const router = Router();

router.get("/", ProjectController.getAllProjects);

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ProjectValidation.createProjectZodSchema),
  ProjectController.createProject
);

router.get("/:id", ProjectController.getProject);

router.put(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ProjectValidation.updateProjectZodSchema),
  ProjectController.updateProject
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
