import { t, UnwrapSchema } from "elysia";

export const ConversationModel = {
  createGroupBody: t.Object({
    name: t.String(),
    avatar: t.Optional(t.String()),
    participantIds: t.Array(t.Number()),
  }),
  createGroupResponse: t.Object({
    message: t.Literal("Conversation created successfully"),
    data: t.Object({
      id: t.Number(),
      name: t.String(),
      avatar: t.Optional(t.String()),
      createdBy: t.Number(),
      createdAt: t.String(),
      updatedAt: t.String(),
    }),
  }),
  createGroupFailed: t.Object({
    message: t.String(),
  }),
  getConversationsResponse: t.Object({
    message: t.Literal("Conversations retrieved successfully"),
    data: t.Array(
      t.Object({
        id: t.Number(),
        name: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        createdBy: t.Number(),
        createdAt: t.String(),
        updatedAt: t.String(),
      }),
    ),
  }),
  getConversationResponse: t.Object({
    message: t.Literal("Conversation retrieved successfully"),
    data: t.Object({
      id: t.Number(),
      name: t.Optional(t.String()),
      avatar: t.Optional(t.String()),
      createdBy: t.Date(),
    }),
  }),

  getMessagesOfConversation: t.Object({
    message: t.Literal("Messages retrieved successfully"),
    data: t.Array(
      t.Object({
        id: t.Number(),
        content: t.Nullable(t.String()),
        attachments: t.Nullable(t.Array(t.String())),
        senderId: t.Number(),
        sender: t.Object({
          id: t.Number(),
          username: t.String(),
          avatar: t.Optional(t.String()),
        }),
        createdAt: t.String(),
        updatedAt: t.String(),
      }),
    ),
  }),
} as const;

export type TConversationModel = {
  [k in keyof typeof ConversationModel]: UnwrapSchema<
    (typeof ConversationModel)[k]
  >;
};
