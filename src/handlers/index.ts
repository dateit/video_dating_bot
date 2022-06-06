import { TelegrafInstance } from '../types';

import { profileHandler } from './profile';
import { startHandler } from './start';
import { adminHandler } from './admin';
import { helpHandler } from './help';
import { userHandler } from './user';
import { removeVideoHandler } from './remove-video';
import { mediaHandler } from './media';

export const registerHandlers = (bot: TelegrafInstance) => {
  bot.start(startHandler);

  bot.command('profile', profileHandler);
  bot.command('admin', adminHandler);
  bot.command('user', userHandler);
  bot.command('help', helpHandler);
  bot.command('removeVideo', removeVideoHandler);
  bot.command('media', mediaHandler);
};
