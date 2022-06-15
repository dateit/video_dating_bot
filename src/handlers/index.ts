import { TelegrafInstance } from '../types';

import { profileHandler } from './profile';
import { startHandler } from './start';
import { adminHandler } from './admin';
import { helpHandler } from './help';
import { userHandler } from './user';
import { removeVideoHandler } from './remove-video';
import { mediaHandler } from './media';

const commands = {
  profile: profileHandler,
  admin: adminHandler,
  user: userHandler,
  removeVideo: removeVideoHandler,
  media: mediaHandler,
  help: helpHandler,
} as const;

export const registerHandlers = (bot: TelegrafInstance) => {
  bot.start(startHandler);

  for (const [command, handler] of Object.entries(commands)) {
    bot.command(command, handler);
  }
};
