import { jwt } from "@elysiajs/jwt";
import Elysia, { status } from "elysia";
import { acessJwt } from "../../utils/jwt";
import { AuthModel } from "../auth/auth.model";
import { AuthService } from "../auth/auth.service";
import { UserModel } from "./user.model";

export const user = new Elysia({ prefix: "/users" }).use(jwt(acessJwt)).get(
  "/me",
  async ({ accessJwt, cookie: { access } }) => {
    const accessToken = access.value;
    if (!accessToken) return status(401, { message: "access token not found" });

    const payload = await accessJwt.verify(access.value as string);
    if (!payload) return { message: "Unauthorized" };

    const userId = payload.id as number;
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return status(404, { message: "User not found" });
    }
    return {
      message: "User retrieved successfully",
      data: {
        username: user.username,
        email: user.email,
      },
    };
  },
  {
    response: {
      200: UserModel.meResponse,
      401: AuthModel.unauthorizedResponse,
      404: AuthModel.notFoundResponse,
    },
  },
);
