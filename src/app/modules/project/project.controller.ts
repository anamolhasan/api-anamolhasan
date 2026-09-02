import { Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/send-response.js";
import catchAsync from "../../utils/catch-async.js";
import { ProjectService } from "./project.service.js";
import { TQueryObject } from "../../types/query.interface.js";

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getAllProjects(
    req.query as TQueryObject
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Projects fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const project = await ProjectService.getProjectById(id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project fetched successfully",
    data: project,
  });
});

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.createProject(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await ProjectService.updateProject(id, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  await ProjectService.deleteProject(id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project deleted successfully",
  });
});

export const ProjectController = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
