import { Role } from '@prisma/client';
import { Message } from 'typegram';

import { formatGender, formatLookingFor } from '../helpers/genders';
import { parseCommandArguments } from '../helpers/parse-command';
import { findUserByTelegram } from '../services/user';
import { IContext } from '../types';

export const userHandler = async (context: IContext) => {
  const { i18n, user: adminUser, message } = context;

  if (adminUser.role !== Role.ADMIN) {
    return;
  }

  const { telegramInfo } = parseCommandArguments(message as Message.TextMessage, 'user', ['telegramInfo'] as const);

  const user = await findUserByTelegram(telegramInfo);

  if (!user) {
    await context.reply(i18n.t('admin.user_not_found'));

    return;
  }

  if (user.videoNoteId) {
    await context.replyWithVideoNote(user.videoNoteId);
  }

  await context.replyWithMarkdownV2(
    i18n.t('admin.user_info', {
      telegramId: user.telegramId,
      username: user.username,
      role: user.role,
      gender: formatGender(user.gender, context),
      lookingFor: formatLookingFor(user.lookingFor, context),
      age: user.age,
      reportsCount: user._count.Reports,
    }),
  );
};
