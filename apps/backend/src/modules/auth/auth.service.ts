import { prisma } from "db";
import { type TAuthModel } from "./auth.model";
export abstract class AuthService {
  static async createUser({
    username,
    email,
    password,
  }: TAuthModel["signUpBody"]) {
    const hash = await Bun.password.hash(password);
    return prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });
  }

  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  static async getUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
