import { t } from "elysia";
import { baseResponse } from "../../utils/schema";

export const UploadModel = {
  uploadResponse: baseResponse({
    message: t.Literal("File uploaded successfully"),
    data: t.Object({
      url: t.String(),
    }),
  }),
} as const;
