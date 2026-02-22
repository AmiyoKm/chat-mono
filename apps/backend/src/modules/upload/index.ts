import Elysia, { status, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { errorResponse } from "../../utils/schema";
import { UploadModel } from "./upload.model";
import { UploadService } from "./upload.service";

export const uploads = new Elysia({ prefix: "/uploads" })
  .use(authPlugin)
  .post(
    "/images",
    async ({ body }) => {
      const file = body.file;

      if (!file)
        return status(400, {
          message: "No file uploaded",
        });

      if (!UploadService.validateImageFile(file)) {
        return status(400, {
          message: "Invalid file type. Only images are allowed.",
        });
      }

      const url = await UploadService.uploadImage(file);
      return {
        message: "File uploaded successfully",
        data: {
          url,
        },
      };
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      response: {
        200: UploadModel.uploadResponse,
        400: errorResponse,
      },
    },
  );
