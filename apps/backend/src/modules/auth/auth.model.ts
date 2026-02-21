import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  signInBody: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  signInResponse: t.Object({
    message: t.String(),
    data: t.Object({
      username: t.String(),
    }),
  }),
  signInFailed: t.Object({
    message: t.Literal("Invalid email or password"),
  }),

  signUpBody: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),
  signUpResponse: t.Object({
    message: t.Literal("User created successfully"),
    data: t.Object({
      username: t.String(),
    }),
  }),
  signUpFailed: t.Object({
    message: t.String(),
  }),

  unauthorizedResponse: t.Object({
    message: t.String(),
  }),

  notFoundResponse: t.Object({
    message: t.Literal("User not found"),
  }),

  signOutResponse: t.Object({
    message: t.Literal("User signed out successfully"),
  }),

  refreshTokenResponse: t.Object({
    message: t.Literal("Token refreshed successfully"),
  }),
} as const;

export type TAuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
