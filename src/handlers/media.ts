import { Role } from '@prisma/client';
import { Message } from 'typegram';

import { parseCommandArguments } from '../helpers/parse-command';
import { findMediaByTelegramId } from '../services/media';
import { Scene } from '../stages/scenes';
import { IContext } from '../types';

export const mediaHandler = async (context: IContext) => {
  const { user, message, scene } = context;

  if (user.role !== Role.ADMIN) {
    return;
  }

  const { telegramMediaId } = parseCommandArguments(message as Message.TextMessage, 'media', [
    'telegramMediaId',
  ] as const);

  if (!telegramMediaId) {
    await scene.enter(Scene.Media);

    return;
  }

  const media = await findMediaByTelegramId(telegramMediaId);

  await context.replyWithMediaGroup([
    {
      type: media.telegramMediaType as 'video',
      media: media.telegramMediaId,
    },
  ]);
};
