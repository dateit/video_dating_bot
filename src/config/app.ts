/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Joi, { assert } from 'joi';

const appConfigSchema = Joi.object({
  port: Joi.number().port().required(),
});

export const config = {
  port: Number(process.env.PORT!),
};

assert(config, appConfigSchema);
