import { t, TSchema } from "elysia";

export const errorResponse = t.Object({
  message: t.String(),
});

export const successResponse = t.Object({
  message: t.String(),
});

export const baseResponse = <M extends TSchema, D extends TSchema>(config: {
  message: M;
  data: D;
}) =>
  t.Object({
    message: config.message,
    data: config.data,
  });
