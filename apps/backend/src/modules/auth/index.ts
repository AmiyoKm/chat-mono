import Elysia from "elysia";

import jwt from "@elysiajs/jwt";
import { status } from "elysia";
import { acessJwt, refreshJwt } from "../../utils/jwt";
import { AuthModel } from "./auth.model";
import { AuthService } from "./auth.service";

class AuthError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export const auth = new Elysia({ prefix: "/auth" })
  .use(jwt(acessJwt))
  .use(jwt(refreshJwt))
  .error({
    AuthError,
  })
  .onError(({ status, error, code }) => {
    if (code === "AuthError") {
      return status(400, {
        message: error.message,
      });
    }
    return status(500, {
      message: "Internal server error",
    });
  })
  .post(
    "sign-up",
    async ({ body, accessJwt, refreshJwt, cookie: { access, refresh } }) => {
      const userExists = await AuthService.getUserByEmail(body.email);
      if (userExists) {
        throw new AuthError("User already exists");
      }

      const user = await AuthService.createUser(body);

      const accessToken = await accessJwt.sign({ id: user.id });
      const refreshToken = await refreshJwt.sign({ id: user.id });

      access.set({
        value: accessToken,
        httpOnly: true,
        maxAge: 15 * 60 * 60,
        path: "/",
      });

      refresh.set({
        value: refreshToken,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/auth/refresh",
      });

      return {
        message: "User created successfully",
        data: {
          username: user.username,
        },
      };
    },
    {
      body: AuthModel.signUpBody,
      response: {
        201: AuthModel.signUpResponse,
        400: AuthModel.signUpFailed,
      },
    },
  )
  .post(
    "sign-in",
    async ({ body, accessJwt, refreshJwt, cookie: { access, refresh } }) => {
      const user = await AuthService.getUserByEmail(body.email);
      if (!user) return status(404, { message: "User not found" });

      const valid = await Bun.password.verify(body.password, user.password);
      if (!valid) return status(401, { message: "Unauthorized" });

      const accessToken = await accessJwt.sign({ id: user.id });
      const refreshToken = await refreshJwt.sign({ id: user.id });

      access.set({
        value: accessToken,
        httpOnly: true,
        maxAge: 15 * 60,
        path: "/",
      });

      refresh.set({
        value: refreshToken,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/auth/refresh",
      });

      return {
        message: "User signed in successfully",
        data: {
          username: user.username,
        },
      };
    },
    {
      body: AuthModel.signInBody,
      response: {
        200: AuthModel.signInResponse,
        400: AuthModel.signInFailed,
        404: AuthModel.notFoundResponse,
        401: AuthModel.unauthorizedResponse,
      },
    },
  )
  .post(
    "sign-out",
    ({ cookie: { access, refresh } }) => {
      access.remove();
      refresh.remove();
      return { message: "User signed out successfully" };
    },
    {
      response: {
        200: AuthModel.signOutResponse,
      },
    },
  )
  .post(
    "refresh",
    async ({ accessJwt, refreshJwt, cookie: { access, refresh } }) => {
      const refreshToken = refresh.value;
      if (!refreshToken)
        return status(401, { message: "Missing refresh token" });

      const payload = await refreshJwt.verify(refreshToken as string);
      if (!payload)
        return status(401, { message: "Invalid or expired refresh token" });

      const newAccessToken = await accessJwt.sign({ id: payload.id });

      access.set({
        value: newAccessToken,
        httpOnly: true,
        maxAge: 15 * 60,
        path: "/",
      });
      return { message: "Token refreshed successfully" };
    },
    {
      response: {
        200: AuthModel.refreshTokenResponse,
        401: AuthModel.unauthorizedResponse,
      },
    },
  );
