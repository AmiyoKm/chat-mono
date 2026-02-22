import { AttachmentType, prisma } from "db";
import { TMessageModel } from "./message.model";

export abstract class MessageService {
  static createMessage = async (input: TMessageModel["messageBody"], userId: number) => {
    const message = await prisma.message.create({
      data: {
        conversationId: input.conversationId,
        senderId: userId,
        content: input.message,
        attachments: {
          create: input.attachments.map((a) => ({
            type: AttachmentType.IMAGE,
            filename: a.filename,
            url: a.url,
            size: a.size,
            mimeType: a.mimeType,
            width: a.width,
            height: a.height,
          })),
        },
      },
      include: {
        attachments: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return message;
  };
}
