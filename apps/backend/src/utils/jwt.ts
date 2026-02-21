import { jwt } from "@elysiajs/jwt";

export const accessJwt = jwt({
  name: "accessJwt",
  secret: process.env.ACCESS_TOKEN_SECRET!,
  exp: "15m",
});

export const refreshJwt = jwt({
  name: "refreshJwt",
  secret: process.env.REFRESH_TOKEN_SECRET!,
  exp: "7d",
});
