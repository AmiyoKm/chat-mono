import { t, type UnwrapSchema } from "elysia";

export const UserModel = {
  meResponse: t.Object({
    message: t.String(),
    data: t.Object({
      username: t.String(),
      email: t.String(),
      avatar: t.Union([t.String(), t.Null()]),
    }),
  }),
} as const;

export type TUserModel = {
  [k in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[k]>;
};
