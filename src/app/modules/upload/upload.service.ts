import cloudinary from "../../config/cloudinary.js";

interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads an image buffer to the "portfolio" folder on Cloudinary.
 */
const uploadImage = async (buffer: Buffer): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned no result"));
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Checks connectivity with Cloudinary.
 */
const ping = async () => {
  return cloudinary.api.ping();
};

/**
 * Destroys a Cloudinary asset by its public id.
 */
const destroyAsset = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Uploads a Cloudinary demo image. Used by the /upload-test endpoint
 * to verify credentials are configured correctly.
 */
const testUpload = async () => {
  return cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    {
      folder: "portfolio-test",
    }
  );
};

/**
 * Extracts the Cloudinary public id out of a delivery URL, e.g.
 * https://res.cloudinary.com/demo/image/upload/v123/portfolio/abc.jpg
 * -> "portfolio/abc"
 */
const getPublicId = (url: string): string => {
  const part = url.split("/upload/")[1];

  const withoutVersion = part.replace(/^v\d+\//, "");

  return withoutVersion.replace(/\.[^/.]+$/, "");
};

export const UploadService = {
  uploadImage,
  ping,
  destroyAsset,
  testUpload,
  getPublicId,
};
