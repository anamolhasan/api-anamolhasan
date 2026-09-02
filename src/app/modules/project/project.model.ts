import { Schema, model } from "mongoose";
import { IProject, ProjectModel } from "./project.interface.js";

const LinkSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },

    slug: {
      type: String,
      trim: true,
      default: "",
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },

    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "Full Stack",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
    },

    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },

    images: {
      type: [String],
      default: [],
      required: [true, "Please upload at least one image"],
    },

    liveLinks: {
      type: [LinkSchema],
      default: [],
    },

    sourceCodes: {
      type: [LinkSchema],
      default: [],
    },

    technologies: {
      type: [String],
      required: [true, "Please provide at least one technology"],
    },
  },
  {
    timestamps: true,
  }
);

const Project = model<IProject, ProjectModel>("Project", ProjectSchema);

export default Project;
