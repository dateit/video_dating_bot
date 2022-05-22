/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Joi, { assert } from 'joi';

const appConfigSchema = Joi.object({
  port: Joi.number().port().required(),
  sentryDsn: Joi.string().required(),
});

export const config = {
  port: Number(process.env.PORT!),
  sentryDsn: process.env.SENTRY_DSN!,
};

assert(config, appConfigSchema);
