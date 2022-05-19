import { Telegraf } from 'telegraf';
import fastify, { FastifyInstance } from 'fastify';
import { Update } from 'typegram';

import { initDatabase, stopDatabase } from './helpers/database';
import { botConfig } from './config';
import { IContext, TelegrafInstance } from './types';
import { registerMiddlewares } from './middlewares';
import { registerHandlers } from './handlers';

const mode = process.env.NODE_ENV ?? 'development';
const isDevelopment = mode === 'development';

const configApp = (app: FastifyInstance, bot: TelegrafInstance) => {
  app.post(botConfig.webhookPath, (request, reply) => {
    void bot.handleUpdate(request.body as Update, reply.raw);
  });

  if (isDevelopment) {
    app.get('/webhook', async () => {
      const data = await bot.telegram.getWebhookInfo();

      return { data };
    });
  }
};

const configBot = async (app: FastifyInstance, bot: TelegrafInstance): Promise<void> => {
  await bot.telegram.deleteWebhook({ drop_pending_updates: true }).catch(() => {
    app.log.info('Webhook was not set');
  });

  const secretPath = `${botConfig.domain}${botConfig.webhookPath}`;
  await bot.telegram.setWebhook(secretPath);

  bot.catch(error => {
    app.log.error(error);
  });

  registerMiddlewares(bot);
  registerHandlers(bot);

  // Enable graceful stop
  process.once('SIGINT', () => {
    bot.stop('SIGINT');
    void stopDatabase();
  });

  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    void stopDatabase();
  });
};

export const startApp = async () => {
  const app = fastify({
    logger: {
      prettyPrint: isDevelopment,
    },
  });

  const bot = new Telegraf<IContext>(botConfig.token);

  configApp(app, bot);
  await configBot(app, bot);
  await initDatabase(app);

  process
    .on('unhandledRejection', reason => {
      app.log.error(`Rejection: ${reason}`);
    })
    .on('uncaughtException', error => {
      app.log.error(`Exception: ${error}`);
    });

  return app;
};
