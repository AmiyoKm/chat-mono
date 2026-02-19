import Elysia from "elysia";

export const auth = new Elysia({ prefix: "/auth" })
  .post("sign-in", () => {})
  .post("sign-up", () => {})
  .get("me", () => {})
  .post("sign-out", () => {})
  .post("refresh", () => {});
