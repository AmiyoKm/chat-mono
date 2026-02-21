import { t, type UnwrapSchema } from "elysia";
import { baseResponse } from "../../utils/schema";

export const UserModel = {
  meResponse: baseResponse({
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
