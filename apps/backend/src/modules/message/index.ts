import Elysia from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";

export const message = new Elysia({ prefix: "/messages" }).use(authPlugin);
