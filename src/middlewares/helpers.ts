import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { MiddlewareFn } from 'telegraf';

import { IContext } from '../types';

export const attachHelpers: MiddlewareFn<IContext> = (context, next) => {
  const replyWithLocalization = async (resourceKey: string, extra?: ExtraReplyMessage) => {
    return context.reply(context.i18n.t(resourceKey), extra);
  };

  context.replyWithLocalization = replyWithLocalization;

  return next();
};
