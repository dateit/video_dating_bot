import { MiddlewareFn } from 'telegraf';

import { findOrCreateUser } from '../services/user';
import { IContext } from '../types';

export const attachUser: MiddlewareFn<IContext> = async (context, next) => {
  if (!context.from?.id) {
    throw new Error('No from field from update');
  }

  const user = await findOrCreateUser(context.from.id, context.from.language_code);

  if (!user) {
    throw new Error(`Failed to find or create user with id ${context.from.id}`);
  }

  context.user = user;

  context.i18n.locale(user.language);

  return next();
};
