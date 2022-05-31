import { Role } from '@prisma/client';

import { IContext } from '../types';

export const userHandler = async (context: IContext) => {
  const { i18n, user } = context;

  if (user.role !== Role.ADMIN) {
    return;
  }

  await context.replyWithMarkdownV2(
    i18n.t('admin.user_info', {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
    }),
  );
};
