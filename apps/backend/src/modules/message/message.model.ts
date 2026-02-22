import { t } from "elysia";

export const MessageModel = {
  messageBody: t.Object({
    message: t.Nullable(t.String()),
    attachments: t.Array(
      t.Object({
        url: t.String(),
        name: t.String(),
      }),
    ),
    conversationId: t.Number(),
  }),
} as const;
