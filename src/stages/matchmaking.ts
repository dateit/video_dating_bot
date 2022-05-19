import { Role } from '@prisma/client';
import { Markup, Scenes } from 'telegraf';

import { findUnmatchedUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum MatchmakingAction {
  like = 'like',
  dislike = 'dislike',
  returnToProfile = 'returnToProfile',
}

const handleMatchmaking = async (context: IContext) => {
  const { i18n, user: contextUser, scene } = context;

  const user = await findUnmatchedUser(contextUser);

  if (!user) {
    await context.replyWithLocalization('matchmaking.no_users');

    return scene.leave();
  }

  await context.replyWithVideoNote(user.videoNoteId);

  await Markup.inlineKeyboard([
    Markup.button.callback(i18n.t('matchmaking.like'), MatchmakingAction.like),
    Markup.button.callback(i18n.t('matchmaking.dislike'), MatchmakingAction.dislike),
    Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
  ]);
};

export const matchmakingScene = new Scenes.BaseScene<IContext>(Scene.Matchmaking);

matchmakingScene.enter(async context => {
  const { from, user: contextUser, scene } = context;

  if (!from.id || contextUser.role === Role.ANONYMOUS) {
    await context.replyWithLocalization('error.anonymous');

    return scene.leave();
  }

  await handleMatchmaking(context);
});

matchmakingScene.action(MatchmakingAction.like, async context => {
  // TODO: implement
  await context.replyWithLocalization('errors.WIP');
});

matchmakingScene.action(MatchmakingAction.dislike, async context => {
  // TODO: implement
  await context.replyWithLocalization('errors.WIP');
});

matchmakingScene.action(MatchmakingAction.returnToProfile, async context => {
  await context.scene.enter(Scene.Profile);
});
