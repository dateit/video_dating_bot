import { TelegrafInstance } from '../types';

import { profileHandler } from './profile';
import { startHandler } from './start';
import { adminHandler } from './admin';
import { helpHandler } from './help';

export const registerHandlers = (bot: TelegrafInstance) => {
  bot.start(startHandler);

  bot.command('profile', profileHandler);
  bot.command('admin', adminHandler);
  bot.command('help', helpHandler);
};
