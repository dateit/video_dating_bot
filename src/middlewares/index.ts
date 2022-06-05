import { stage } from '../stages';
import { TelegrafInstance } from '../types';

import { attachHelpers } from './helpers';
import { attachI18n } from './i18n';
import { attachSentry } from './sentry';
import { attachPostgresSession } from './session';
import { attachUser } from './user';

const middlewares = [
  attachPostgresSession,
  attachHelpers,
  attachI18n,
  attachUser,
  stage.middleware(),
  attachSentry,
] as const;

export const registerMiddlewares = (bot: TelegrafInstance) => {
  for (const middleware of middlewares) {
    bot.use(middleware);
  }
};
