/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Joi, { assert } from 'joi';

const databaseConfigSchema = Joi.object({
  url: Joi.string().required(),
});

export const config = {
  url: process.env.DATABASE_URL!,
};

assert(config, databaseConfigSchema);
