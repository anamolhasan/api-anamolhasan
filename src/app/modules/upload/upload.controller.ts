import { Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/send-response.js";
import catchAsync from "../../utils/catch-async.js";
import { UploadService } from "./upload.service.js";
import AppError from "../../errorHelpers/AppError.js";

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(status.BAD_REQUEST, "Invalid file");
  }

  const result = await UploadService.uploadImage(req.file.buffer);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});

const cloudinaryHealthCheck = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await UploadService.ping();

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Cloudinary is reachable",
      data: { result },
    });
  }
);

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.body as { publicId?: string };

  if (!publicId || typeof publicId !== "string") {
    throw new AppError(status.BAD_REQUEST, "publicId is required");
  }

  const result = await UploadService.destroyAsset(publicId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
});

const testUpload = catchAsync(async (_req: Request, res: Response) => {
  const result = await UploadService.testUpload();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Test upload completed successfully",
    data: { url: result.secure_url },
  });
});

export const UploadController = {
  uploadFile,
  cloudinaryHealthCheck,
  deleteImage,
  testUpload,
};
