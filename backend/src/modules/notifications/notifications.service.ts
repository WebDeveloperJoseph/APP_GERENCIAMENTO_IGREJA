import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

interface RegisterPushTokenDTO {
  memberId: string;
  token: string;
  platform: string;
}

interface EventPushData {
  id: string;
  title: string;
  startDate: Date;
  location: string | null;
  coverImageUrl: string | null;
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

class NotificationsService {
  async registerPushToken({
    memberId,
    token,
    platform,
  }: RegisterPushTokenDTO) {
    if (!Expo.isExpoPushToken(token)) {
      throw new AppError("Token de notificacao invalido.", 400);
    }

    if (!["android", "ios"].includes(platform)) {
      throw new AppError("Plataforma de notificacao invalida.", 400);
    }

    return prisma.pushToken.upsert({
      where: { token },
      create: {
        token,
        platform,
        memberId,
      },
      update: {
        platform,
        memberId,
      },
    });
  }

  async removePushToken(memberId: string, token: string) {
    await prisma.pushToken.deleteMany({
      where: {
        memberId,
        token,
      },
    });
  }

  async sendNewEventNotification(event: EventPushData) {
    const storedTokens = await prisma.pushToken.findMany({
      where: {
        member: {
          isActive: true,
        },
      },
      select: {
        token: true,
      },
    });

    const validTokens = storedTokens
      .map(({ token }) => token)
      .filter(Expo.isExpoPushToken);

    if (validTokens.length === 0) {
      logger.info("push_notification_skipped", {
        eventId: event.id,
        reason: "no_registered_tokens",
      });
      return;
    }

    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      title: "Novo evento na Igreja Connect",
      body: `${event.title} - ${formatEventDate(event.startDate)}`,
      sound: "default",
      channelId: "church-events",
      priority: "high",
      data: {
        eventId: event.id,
        route: `/events/${event.id}`,
      },
      ...(event.coverImageUrl
        ? { richContent: { image: event.coverImageUrl } }
        : {}),
    }));

    let sentCount = 0;
    const invalidTokens: string[] = [];

    for (const chunk of expo.chunkPushNotifications(messages)) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      tickets.forEach((ticket, index) => {
        const token = chunk[index]?.to;

        if (ticket.status === "ok") {
          sentCount += 1;
          return;
        }

        if (
          ticket.details?.error === "DeviceNotRegistered" &&
          typeof token === "string"
        ) {
          invalidTokens.push(token);
        }
      });
    }

    if (invalidTokens.length > 0) {
      await prisma.pushToken.deleteMany({
        where: {
          token: {
            in: invalidTokens,
          },
        },
      });
    }

    logger.info("push_notification_sent", {
      eventId: event.id,
      recipientCount: sentCount,
      removedTokenCount: invalidTokens.length,
    });
  }
}

export { NotificationsService };
