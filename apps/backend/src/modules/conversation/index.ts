import Elysia, { status } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
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

      const conversation = await ConversationService.createGroup({
        creatorId: user.id,
        name: body.name,
        avatar: body.avatar,
        participantIds: body.participantIds,
      });
      return conversation;
    },
    {
      body: ConversationModel.createGroupBody,
      200: ConversationModel.createGroupResponse,
    },
  );
