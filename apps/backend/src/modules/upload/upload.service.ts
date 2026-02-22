import { uploadBuffer } from "../../utils/cloudinary";

export abstract class UploadService {
  static validateImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  static uploadImage = async (
    file: File,
  ): Promise<{
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    width?: number;
    height?: number;
  }> => {
    const buffer = await file.arrayBuffer();
    const result = await uploadBuffer(Buffer.from(buffer), "images");

    return {
      url: result.secure_url,
      filename: result.original_filename,
      size: result.bytes,
      mimeType: `image/${result.format}`,
      width: result.width,
      height: result.height,
    };
  };
}
