import Elysia from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { MessageService } from "./model.service";

export const message = new Elysia({ prefix: "/messages" })
  .use(authPlugin)
  .post("/", async ({ body, user }) => {
    const message = await MessageService.createMessage();

    return message;
  });
