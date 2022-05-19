/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Joi, { assert } from 'joi';

const botConfigSchema = Joi.object({
  token: Joi.string().required(),
  webhookPath: Joi.string().required(),
  domain: Joi.string().required(),
});

export const config = {
  token: process.env.BOT_TOKEN!,
  webhookPath: process.env.WEBHOOK_PATH!,
  domain: process.env.DOMAIN!,
};

assert(config, botConfigSchema);
