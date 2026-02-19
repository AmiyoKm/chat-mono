import { t, type UnwrapSchema } from "elysia";

const AuthModel = {
  signInBody: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  signInResponse: t.Object({
    username: t.String(),
    token: t.String(),
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
    username: t.String(),
    token: t.String(),
  }),
  signUpFailed: t.Object({
    message: t.String(),
  }),
} as const;

export type TAuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
