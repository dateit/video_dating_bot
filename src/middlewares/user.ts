import { MiddlewareFn } from 'telegraf';

import { findOrCreateUser, updateUser } from '../services/user';
import { IContext } from '../types';

export const attachUser: MiddlewareFn<IContext> = async (context, next) => {
  if (!context.from?.id) {
    throw new Error('No from field from update');
  }

  const user = await findOrCreateUser(context.from.id, {
    username: context.from.username,
    firstname: context.from.first_name,
    lastname: context.from.last_name,
    language: context.from.language_code,
    telegramChatId: String(context.chat.id),
  });

  if (!user) {
    throw new Error(`Failed to find or create user with id ${context.from.id}`);
  }

  if (context.from.username && context.from.username !== user.username) {
    await updateUser(context.from.id, { username: context.from.username });
  }

  if (String(context.chat.id) !== user.telegramChatId) {
    await updateUser(context.from.id, { telegramChatId: String(context.chat.id) });
  }

  context.user = user;

  // context.i18n.locale(user.language);
  // NOTE: We are using only russian language for now
  context.i18n.locale('ru');

  return next();
};
