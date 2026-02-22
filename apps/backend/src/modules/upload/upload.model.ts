import { t } from "elysia";
import { baseResponse } from "../../utils/schema";

export const UploadModel = {
  uploadResponse: baseResponse({
    message: t.Literal("File uploaded successfully"),
    data: t.Object({
      url: t.String(),
      filename: t.String(),
      size: t.Number(),
      mimeType: t.String(),
      width: t.Optional(t.Number()),
      height: t.Optional(t.Number()),
    }),
  }),
} as const;
