import { MiddlewareFn } from 'telegraf';

import { IContext, ISession } from '../types';
import { prisma } from '../helpers/database';

const getSessionKey = (context: IContext): string => {
  let chatInstance;
  if (context.chat) {
    chatInstance = context.chat.id;
  } else if (context.updateType === 'callback_query') {
    chatInstance = context.callbackQuery.chat_instance;
  } else {
    chatInstance = context.from.id;
  }
  return `${chatInstance}:${context.from.id}`;
};

const saveSession = (key: string, session: ISession) => {
  const data = JSON.stringify(session);

  return prisma.session.upsert({
    where: { id: key },
    update: { data },
    create: {
      data,
      id: key,
    },
  });
};

const getSession = async (key: string) => {
  try {
    const data = await prisma.session.findUnique({ where: { id: key }, rejectOnNotFound: true });

    return JSON.parse(data.data);
  } catch {
    return {};
  }
};

export const attachPostgresSession: MiddlewareFn<IContext> = async (context, next) => {
  const key = getSessionKey(context);

  context.session = await getSession(key);

  await next();

  if (context.session !== undefined) {
    await saveSession(key, context.session);
  }
};
