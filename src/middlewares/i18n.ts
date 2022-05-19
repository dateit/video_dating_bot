import path from 'node:path';
import I18n from 'telegraf-i18n';

export const i18n = new I18n({
  defaultLanguage: 'en',
  useSession: true,
  // eslint-disable-next-line unicorn/prefer-module
  directory: path.resolve(__dirname, './../../locales'),
});

export const attachI18n = i18n.middleware();
