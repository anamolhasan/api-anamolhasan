import { Model } from "mongoose";

export interface IProjectLink {
  label: string;
  url: string;
}

export type ProjectStatus = "published" | "draft" | "archived";

export interface IProject {
  title: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  thumbnail?: string;
  images: string[];
  liveLinks: IProjectLink[];
  sourceCodes: IProjectLink[];
  technologies: string[];
  category?: string;
  featured?: boolean;
  status?: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectModel extends Model<IProject> {
  // statics can be declared here if needed
}
