import { IContext } from '../types';

export const setCommands = (context: Partial<IContext>) => {
  const { i18n, telegram } = context;

  return telegram.setMyCommands([
    {
      command: 'profile',
      description: i18n.t('command.profile'),
    },
    {
      command: 'help',
      description: i18n.t('command.help'),
    },
  ]);
};
