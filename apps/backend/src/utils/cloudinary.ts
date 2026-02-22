import { Readable } from "stream";
import { cloudinaryConfig } from "../config/cloudinary";

export function uploadBuffer(
  buffer: Buffer,
  folder: string,
  resource_type: "image" | "raw" = "image",
) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinaryConfig.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}
