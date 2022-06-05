import { MiddlewareFn } from 'telegraf';
import * as Sentry from '@sentry/node';
import { Message } from 'typegram';

import { IContext } from '../types';

const buildTransactionName = (message: Message, context: IContext): string => {
  const textMessage = (message as Message.TextMessage).text;

  if (textMessage) {
    return textMessage.split(' ')[0];
  }

  const videoNoteMessage = (message as Message.VideoNoteMessage).video_note;

  if (videoNoteMessage) {
    return 'video_note';
  }

  if (context.scene?.current) {
    return context.scene.current.id;
  }

  return 'message';
};

export const attachSentry: MiddlewareFn<IContext> = async (context, next) => {
  const { user, message } = context;

  const name = buildTransactionName(message, context);

  const transaction = Sentry.startTransaction({
    name,
    op: 'telegram.message',
    description: 'Telegram message',
  });

  transaction.setData('user', user);
  transaction.setData('message', message);

  context.sentryTx = transaction;

  await next();

  transaction.finish();
};
