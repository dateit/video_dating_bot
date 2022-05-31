import { Role } from '@prisma/client';

import { IContext } from '../types';

export const setUserCommand = (context: IContext) => {
  const { i18n, user, telegram } = context;

  const commandsByRole = {
    [Role.ANONYMOUS]: [
      {
        command: 'start',
        description: i18n.t('command.start'),
      },
    ],
    [Role.USER]: [
      {
        command: 'profile',
        description: i18n.t('command.profile'),
      },
      {
        command: 'help',
        description: i18n.t('command.help'),
      },
    ],
    [Role.ADMIN]: [
      {
        command: 'profile',
        description: i18n.t('command.profile'),
      },
      {
        command: 'help',
        description: i18n.t('command.help'),
      },
      {
        command: 'admin',
        description: i18n.t('command.admin'),
      },
      {
        command: 'user',
        description: i18n.t('command.user'),
      },
    ],
  } as const;

  return telegram.setMyCommands(commandsByRole[user.role]);
};
