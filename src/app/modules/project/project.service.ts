import status from "http-status";
import Project from "./project.model.js";
import { IProject } from "./project.interface.js";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import {
  PROJECT_FILTERABLE_FIELDS,
  PROJECT_SEARCHABLE_FIELDS,
} from "./project.constant.js";
import { UploadService } from "../upload/upload.service.js";
import { TQueryObject } from "../../types/query.interface.js";

const getAllProjects = async (query: TQueryObject) => {
  return new QueryBuilder(Project, query)
    .search(PROJECT_SEARCHABLE_FIELDS)
    .filter(PROJECT_FILTERABLE_FIELDS)
    .paginate()
    .sort()
    .fields()
    .execute();
};

const getProjectById = async (id: string): Promise<IProject> => {
  const project = await Project.findById(id);

  if (!project) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return project;
};

const createProject = async (payload: Partial<IProject>): Promise<IProject> => {
  return Project.create(payload);
};

const updateProject = async (
  id: string,
  payload: Partial<IProject>
): Promise<IProject> => {
  const existingProject = await Project.findById(id);

  if (!existingProject) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  const updatedProject = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProject) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return updatedProject;
};

const deleteProject = async (id: string): Promise<void> => {
  const project = await Project.findById(id);

  if (!project) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  // Delete every hosted asset from Cloudinary before removing the document.
  const assetUrls = [...(project.images ?? [])];

  if (project.thumbnail && project.thumbnail.includes("/upload/")) {
    assetUrls.push(project.thumbnail);
  }

  await Promise.all(
    assetUrls
      .filter((url) => url.includes("/upload/"))
      .map((url) =>
        UploadService.destroyAsset(UploadService.getPublicId(url)).catch(
          () => null
        )
      )
  );

  await Project.findByIdAndDelete(id);
};

export const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
