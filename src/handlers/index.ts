import { TelegrafInstance } from '../types';

import { profileHandler } from './profile';
import { startHandler } from './start';

export const registerHandlers = (bot: TelegrafInstance) => {
  bot.start(startHandler);
  bot.command('profile', profileHandler);
};
