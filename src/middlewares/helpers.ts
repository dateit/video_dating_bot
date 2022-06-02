import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Markup, MiddlewareFn } from 'telegraf';

import { IContext } from '../types';

export const attachHelpers: MiddlewareFn<IContext> = (context, next) => {
  const replyWithLocalization = async (resourceKey: string, extra?: ExtraReplyMessage) => {
    return context.reply(context.i18n.t(resourceKey), extra);
  };

  const clearUpKeyboard = async () => {
    await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);
  };

  context.replyWithLocalization = replyWithLocalization;
  context.clearUpKeyboard = clearUpKeyboard;

  return next();
};
