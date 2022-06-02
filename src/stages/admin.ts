import { Markup, Scenes } from 'telegraf';

import { usersInfo } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum AdminAction {
  usersList = 'usersList',
  deleteVideo = 'deleteVideo',
}

export const adminScene = new Scenes.BaseScene<IContext>(Scene.Admin);

adminScene.enter(async context => {
  const { i18n } = context;

  const userStats = await usersInfo();

  await context.replyWithLocalization('admin.text');

  await context.replyWithMarkdownV2(
    i18n.t('admin.welcome', userStats),
    Markup.inlineKeyboard([Markup.button.callback(i18n.t('admin.users_list'), AdminAction.usersList)]),
  );
});

adminScene.action(AdminAction.usersList, async context => {
  const { i18n } = context;

  await context.clearUpKeyboard();

  await context.replyWithMarkdownV2(
    i18n.t('admin.user'),
    Markup.inlineKeyboard([Markup.button.callback(i18n.t('admin.back'), AdminAction.usersList)]),
  );
});
