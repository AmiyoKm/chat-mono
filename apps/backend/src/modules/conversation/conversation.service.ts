import { ConversationType, ParticipantRole, prisma } from "db";
import { TConversationModel } from "./conversation.model";

export abstract class ConversationService {
  static isParticipant = async ({
    conversationId,
    userId,
  }: {
    conversationId: number;
    userId: number;
  }) => {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    return !!participant;
  };

  static createGroup = async ({
    name,
    avatar,
    participantIds,
    creatorId,
  }: TConversationModel["createGroupBody"] & { creatorId: number }) => {
    const allParticipantIds = [...participantIds, creatorId];
    const conversation = await prisma.conversation.create({
      data: {
        name,
        avatar,
        creator: {
          connect: { id: creatorId },
        },
        participants: {
          create: allParticipantIds.map((participantId) => ({
            userId: participantId,
            role:
              participantId === creatorId
                ? ParticipantRole.ADMIN
                : ParticipantRole.MEMBER,
          })),
        },
        type: ConversationType.GROUP,
      },
    });

    return conversation;
  };

  static existingDm = async ({
    creatorId,
    participantId,
  }: {
    creatorId: number;
    participantId: number;
  }) => {
    const conversation = await prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          {
            participants: {
              some: {
                userId: creatorId,
              },
            },
          },
          {
            participants: {
              some: {
                userId: participantId,
              },
            },
          },
        ],
      },
    });

    return !!conversation;
  };

  static createDm = async ({
    creatorId,
    participantId,
  }: {
    creatorId: number;
    participantId: number;
  }) => {
    const conversation = await prisma.conversation.create({
      data: {
        creator: {
          connect: { id: creatorId },
        },
        participants: {
          create: [
            {
              userId: creatorId,
              role: ParticipantRole.MEMBER,
            },
            {
              userId: participantId,
              role: ParticipantRole.MEMBER,
            },
          ],
        },
        type: ConversationType.DIRECT,
      },
    });

    return conversation;
  };

  static getMessages = async ({
    conversationId,
    page,
    limit,
  }: {
    conversationId: number;
    page: number;
    limit: number;
  }) => {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return messages;
  };

  static countMessages = async ({
    conversationId,
  }: {
    conversationId: number;
  }) => {
    const count = await prisma.message.count({
      where: {
        conversationId,
      },
    });

    return count;
  };
}
