export const acessJwt = {
  name: "accessJwt",
  secret: process.env.ACCESS_TOKEN_SECRET!,
  exp: "15m",
} as const;

export const refreshJwt = {
  name: "refreshJwt",
  secret: process.env.REFRESH_TOKEN_SECRET!,
  exp: "7d",
} as const;
