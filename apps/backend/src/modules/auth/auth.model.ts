import { t, type UnwrapSchema } from "elysia";
import { baseResponse } from "../../utils/schema";

export const AuthModel = {
  signInBody: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  signInResponse: baseResponse({
    message: t.Literal("User signed in successfully"),
    data: t.Object({
      username: t.String(),
    }),
  }),

  signUpBody: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),
  signUpResponse: baseResponse({
    message: t.Literal("User created successfully"),
    data: t.Object({
      username: t.String(),
    }),
  }),
} as const;

export type TAuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
