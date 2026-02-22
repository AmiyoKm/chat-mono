import Elysia from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { MessageService } from "./model.service";
import { MessageModel } from "./message.model";

export const message = new Elysia({ prefix: "/messages" })
  .use(authPlugin)
  .post(
    "/",
    async ({ body, user }) => {
      const msg = await MessageService.createMessage(body, user.id);

      return {
        message: "Message created successfully",
        data: { id: msg.id },
      };
    },
    {
      body: MessageModel.messageBody,
      response: {
        200: MessageModel.createMessageResponse,
      },
    },
  );
