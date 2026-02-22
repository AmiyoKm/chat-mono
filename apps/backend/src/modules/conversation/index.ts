import Elysia, { status, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { errorResponse } from "../../utils/schema";
import { ConversationModel } from "./conversation.model";
import { ConversationService } from "./conversation.service";

export const conversation = new Elysia({ prefix: "/conversations" })
  .use(authPlugin)
  .post(
    "/group",
    async ({ user, body }) => {
      if (body.participantIds.length < 1) {
        return status(400, {
          message: "At least one participant is required",
        });
      }

      if (body.participantIds.includes(user.id)) {
        return status(400, {
          message: "You cannot add yourself as a participant",
        });
      }

      if (new Set(body.participantIds).size !== body.participantIds.length) {
        return status(400, {
          message: "Duplicate participant IDs are not allowed",
        });
      }

      const conversation = await ConversationService.createGroup({
        creatorId: user.id,
        name: body.name,
        avatar: body.avatar,
        participantIds: body.participantIds,
      });
      return status(201, {
        message: "Group Conversation created successfully",
        data: {
          id: conversation.id,
          name: conversation.name,
          avatar: conversation.avatar,
          type: conversation.type,
          createdBy: conversation.createdBy,
          createdAt: conversation.createdAt.toISOString(),
          updatedAt: conversation.updatedAt.toISOString(),
        },
      });
    },
    {
      body: ConversationModel.createGroupBody,
      response: {
        201: ConversationModel.createGroupResponse,
        400: errorResponse,
      },
    },
  )
  .post(
    "/dm",
    async ({ user, body }) => {
      if (body.participantId === user.id) {
        return status(400, {
          message: "You cannot create a conversation with yourself",
        });
      }

      const existingConversation = await ConversationService.existingDm({
        creatorId: user.id,
        participantId: body.participantId,
      });
      if (existingConversation) {
        return status(400, {
          message: "Conversation already exists",
        });
      }

      const conversation = await ConversationService.createDm({
        creatorId: user.id,
        participantId: body.participantId,
      });
      return {
        message: "Direct Conversation created successfully",
        data: {
          id: conversation.id,
          name: conversation.name,
          avatar: conversation.avatar,
          type: conversation.type,
          createdBy: conversation.createdBy,
          createdAt: conversation.createdAt.toISOString(),
          updatedAt: conversation.updatedAt.toISOString(),
        },
      };
    },
    {
      body: ConversationModel.createDmBody,
      response: {
        201: ConversationModel.createDmResponse,
        400: errorResponse,
      },
    },
  )
  .get(
    "/:id/messages",
    async ({ user, params, query }) => {
      const page = Math.max(1, query.page || 1);
      const limit = Math.min(100, Math.max(1, query.limit || 20));

      const isParticipant = await ConversationService.isParticipant({
        conversationId: params.id,
        userId: user.id,
      });

      if (!isParticipant) {
        return status(403, {
          message: "You are not a participant of this conversation",
        });
      }

      const messages = await ConversationService.getMessages({
        conversationId: params.id,
        page,
        limit,
      });

      const total = await ConversationService.countMessages({
        conversationId: params.id,
      });

      return {
        message: "Messages retrieved successfully",
        data: {
          messages: messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            attachments: msg.attachments.map((attachment) => ({
              id: attachment.id,
              type: attachment.type,
              filename: attachment.filename,
              url: attachment.url,
              size: attachment.size,
              mimeType: attachment.mimeType,
              width: attachment.width,
              height: attachment.height,
            })),
            sender: {
              id: msg.sender.id,
              username: msg.sender.username,
              avatar: msg.sender.avatar ?? undefined,
            },
            createdAt: msg.createdAt.toISOString(),
            updatedAt: msg.updatedAt.toISOString(),
          })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      query: ConversationModel.getMessagesQuery,
      response: {
        200: ConversationModel.getMessagesOfConversation,
        403: errorResponse,
      },
    },
  );
