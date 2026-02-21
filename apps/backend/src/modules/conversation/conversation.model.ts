import { ConversationType } from "db";
import { t, UnwrapSchema } from "elysia";
import { baseResponse } from "../../utils/schema";

export const ConversationModel = {
  createDmBody: t.Object({
    participantId: t.Number(),
  }),

  createDmResponse: baseResponse({
    message: t.Literal("Conversation created successfully"),
    data: t.Object({
      id: t.Number(),
      name: t.Optional(t.String()),
      avatar: t.Optional(t.String()),
      type: t.Literal(ConversationType.DIRECT),
      createdBy: t.Number(),
      createdAt: t.String(),
      updatedAt: t.String(),
    }),
  }),

  createGroupBody: t.Object({
    name: t.String(),
    avatar: t.Optional(t.String()),
    participantIds: t.Array(t.Number()),
  }),
  createGroupResponse: baseResponse({
    message: t.Literal("Conversation created successfully"),
    data: t.Object({
      id: t.Number(),
      name: t.String(),
      avatar: t.Optional(t.String()),
      type: t.Literal(ConversationType.GROUP),
      createdBy: t.Number(),
      createdAt: t.String(),
      updatedAt: t.String(),
    }),
  }),

  getConversationsResponse: baseResponse({
    message: t.Literal("Conversations retrieved successfully"),
    data: t.Object({
      conversations: t.Array(
        t.Object({
          id: t.Number(),
          name: t.Optional(t.String()),
          avatar: t.Optional(t.String()),
          createdBy: t.Number(),
          createdAt: t.String(),
          updatedAt: t.String(),
        }),
      ),
      pagination: t.Object({
        total: t.Number(),
        page: t.Number(),
        limit: t.Number(),
        totalPages: t.Number(),
      }),
    }),
  }),

  getMessagesOfConversation: baseResponse({
    message: t.Literal("Messages retrieved successfully"),
    data: t.Object({
      messages: t.Array(
        t.Object({
          id: t.Number(),
          content: t.Nullable(t.String()),
          attachments: t.Nullable(
            t.Array(
              t.Object({
                id: t.Number(),
                type: t.String(),
                filename: t.String(),
                url: t.String(),
                size: t.Number(),
                mimeType: t.String(),
                width: t.Nullable(t.Number()),
                height: t.Nullable(t.Number()),
              }),
            ),
          ),
          sender: t.Object({
            id: t.Number(),
            username: t.String(),
            avatar: t.Optional(t.String()),
          }),
          createdAt: t.String(),
          updatedAt: t.String(),
        }),
      ),
      pagination: t.Object({
        total: t.Number(),
        page: t.Number(),
        limit: t.Number(),
        totalPages: t.Number(),
      }),
    }),
  }),

  getMessagesQuery: t.Object({
    limit: t.Optional(t.Number()),
    page: t.Optional(t.Number()),
  }),
} as const;

export type TConversationModel = {
  [k in keyof typeof ConversationModel]: UnwrapSchema<
    (typeof ConversationModel)[k]
  >;
};
