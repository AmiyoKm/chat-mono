import Elysia, { status } from "elysia";
import { AuthService } from "../modules/auth/auth.service";
import { accessJwt } from "../utils/jwt";

export const authPlugin = new Elysia({ name: "auth" })
  .use(accessJwt)
  .derive({ as: "global" }, async ({ cookie: { access }, accessJwt }) => {
    if (!access.value) {
      return status(401, { message: "access token not found" });
    }

    const payload = await accessJwt.verify(access.value as string);
    if (!payload) return status(401, { message: "Invalid access token" });

    const userId = payload.id as number;
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return status(404, { message: "User not found" });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  });
