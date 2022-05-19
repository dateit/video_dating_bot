import { User } from 'typegram';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { MiddlewareFn } from 'telegraf';

import { IContext } from '../types';

const whois = (from?: User) => {
  if (from) {
    const id = from.id;
    const firstName = from.first_name;
    const lastName = from.last_name ?? '';
    return `${id}:${firstName}` + ` ${lastName}`;
  }

  return 'unknown';
};

export const attachHelpers: MiddlewareFn<IContext> = (context, next) => {
  const replyWithLocalization = async (resourceKey: string, extra?: ExtraReplyMessage) => {
    return context.reply(context.i18n.t(resourceKey), extra);
  };

  context.replyWithLocalization = replyWithLocalization;
  context.whois = whois;

  return next();
};
