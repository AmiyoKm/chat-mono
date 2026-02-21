import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { conversation } from "./modules/conversation";
import { user } from "./modules/user";

const app = new Elysia({ prefix: "/api" })
  .use(openapi())
  .use(logger())
  .use(cors())
  .use(auth)
  .use(user)
  .use(conversation)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
