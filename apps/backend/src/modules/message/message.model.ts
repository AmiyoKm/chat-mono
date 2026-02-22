import { t, UnwrapSchema } from "elysia";
import { baseResponse } from "../../utils/schema";

export const MessageModel = {
  messageBody: t.Object({
    message: t.Nullable(t.String()),
    attachments: t.Array(
      t.Object({
        type: t.Union([t.Literal("IMAGE"), t.Literal("FILE")]),
        url: t.String(),
        filename: t.String(),
        size: t.Number(),
        mimeType: t.String(),
        width: t.Optional(t.Number()),
        height: t.Optional(t.Number()),
      }),
    ),
    conversationId: t.Number(),
  }),

  createMessageResponse: baseResponse({
    message: t.Literal("Message created successfully"),
    data: t.Object({
      id: t.Number(),
    }),
  }),
} as const;

export type TMessageModel = {
  [k in keyof typeof MessageModel]: UnwrapSchema<(typeof MessageModel)[k]>;
};
