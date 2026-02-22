import { uploadBuffer } from "../../utils/cloudinary";

export abstract class UploadService {
  static validateImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  static uploadImage = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    return await uploadBuffer(Buffer.from(buffer), "images");
  };
}
