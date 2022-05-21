import { Telegraf } from 'telegraf';

import { stage } from '../stages';
import { TelegrafInstance } from '../types';

import { attachHelpers } from './helpers';
import { attachI18n } from './i18n';
import { attachPostgresSession } from './session';
import { attachUser } from './user';

const middlewares = [Telegraf.log(), attachPostgresSession, attachHelpers, attachI18n, attachUser, stage.middleware()];

export const registerMiddlewares = (bot: TelegrafInstance) => {
  for (const middleware of middlewares) {
    bot.use(middleware);
  }
};
