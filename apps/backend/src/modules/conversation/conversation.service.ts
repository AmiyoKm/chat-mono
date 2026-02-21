import { ParticipantRole, prisma } from "db";
import { TConversationModel } from "./conversation.model";

export abstract class ConversationService {
  static createGroup = async ({
    name,
    avatar,
    participantIds,
    creatorId,
  }: TConversationModel["createGroupBody"] & { creatorId: number }) => {
    participantIds.push(creatorId);
    const conversation = await prisma.conversation.create({
      data: {
        name,
        avatar,
        creator: {
          connect: { id: creatorId },
        },
        participants: {
          create: participantIds.map((participantId) => ({
            userId: participantId,
            role:
              participantId === creatorId
                ? ParticipantRole.ADMIN
                : ParticipantRole.MEMBER,
          })),
        },
      },
    });

    return conversation;
  };
}
