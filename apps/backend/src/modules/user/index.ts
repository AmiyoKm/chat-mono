import Elysia from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { UserModel } from "./user.model";

export const user = new Elysia({ prefix: "/users" }).use(authPlugin).get(
  "/me",
  async ({ user }) => {
    return {
      message: "User retrieved successfully",
      data: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  },
  {
    response: {
      200: UserModel.meResponse,
    },
  },
);
