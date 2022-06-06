import { Role } from '@prisma/client';
import { Message } from 'typegram';

import { addDeletedVideos, findUserByTelegram, updateUser } from '../services/user';
import { parseCommandArguments } from '../helpers/parse-command';
import { IContext } from '../types';

export const removeVideoHandler = async (context: IContext) => {
  const { i18n, user: adminUser, message, telegram } = context;

  if (adminUser.role !== Role.ADMIN) {
    return;
  }

  const { telegramInfo, reason } = parseCommandArguments(message as Message.TextMessage, 'removeVideo', [
    'telegramInfo',
    'reason',
  ] as const);

  const user = await findUserByTelegram(telegramInfo);

  if (!user) {
    await context.reply(i18n.t('admin.user_not_found'));

    return;
  }

  if (!user.videoNoteId) {
    await context.reply(i18n.t('admin.no_video_note'));

    return;
  }

  await addDeletedVideos({
    videoId: user.videoNoteId,
    userId: user.id,
    reason,
  });
  // eslint-disable-next-line unicorn/no-null
  await updateUser(user.telegramId, { videoNoteId: null });

  await context.reply(i18n.t('admin.video_deleted'));

  await telegram.sendMessage(user.telegramChatId, i18n.t('admin.video_deleted_message', { reason }));
};
