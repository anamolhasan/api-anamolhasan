import dotenv from "dotenv";
import path from "path";
import AppError from "../errorHelpers/AppError.js";
import status from "http-status";


const envFilePath = process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({
   path: path.join(process.cwd(), envFilePath) 
  });

interface EnvConfig {
  NODE_ENV : string;
  PORT:string;
  CLIENT_URL:string;
  API_BASE_URL:string;
  MONGODB_URI:string;
  CLOUDINARY:{
    CLOUDINARY_CLOUD_NAME:string;
    CLOUDINARY_API_KEY:string;
    CLOUDINARY_API_SECRET:string;
  },
  CLERK:{
    CLERK_PUBLISHABLE_KEY:string;
    CLERK_SECRET_KEY:string;
  },
  SWAGGER:{
    SWAGGER_ENABLED:string;
    SWAGGER_PATH:string;
  }
}

const loadEnvVariables = (): EnvConfig => {
  const env = process.env

  const requireEnvVariables = [
    'NODE_ENV',
    'PORT',
    'CLIENT_URL',
    'API_BASE_URL',
    'MONGODB_URI',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'SWAGGER_ENABLED',
    'SWAGGER_PATH',
  ]

  requireEnvVariables.forEach((variable) => {
    if(!env[variable]){
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is require but not set in .env file.`
      )
    }
  })

  return {
    NODE_ENV : env.NODE_ENV as string,
    PORT : env.PORT as string,
    CLIENT_URL : env.CLIENT_URL as string,
    API_BASE_URL : env.API_BASE_URL as string,
    MONGODB_URI : env.MONGODB_URI as string,
    CLOUDINARY : {
      CLOUDINARY_CLOUD_NAME : env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY : env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET : env.CLOUDINARY_API_SECRET as string
    },
    CLERK:{
      CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY as string,
      CLERK_SECRET_KEY : env.CLERK_SECRET_KEY as string,
    },
    SWAGGER:{
      SWAGGER_ENABLED : env.SWAGGER_ENABLED as string,
      SWAGGER_PATH : env.SWAGGER_PATH as string,
    }
  }
}

export const envVars = loadEnvVariables()

