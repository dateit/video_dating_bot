/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();

import { config as _appConfig } from './app';
import { config as _botConfig } from './bot';
import { config as _databaseConfig } from './database';

export const appConfig = Object.freeze(_appConfig);
export const botConfig = Object.freeze(_botConfig);
export const databaseConfig = Object.freeze(_databaseConfig);
