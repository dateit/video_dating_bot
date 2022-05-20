import { Markup, Scenes } from 'telegraf';

import { findUnmatchedUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum MatchmakingAction {
  like = 'like',
  dislike = 'dislike',
  returnToProfile = 'returnToProfile',
}

export const matchmakingScene = new Scenes.BaseScene<IContext>(Scene.Matchmaking);

matchmakingScene.enter(async context => {
  const { i18n, user: contextUser } = context;

  const user = await findUnmatchedUser(contextUser);

  if (!user) {
    await context.editMessageText(
      i18n.t('matchmaking.no_users'),
      Markup.inlineKeyboard([
        Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
      ]),
    );

    return;
  }

  await context.replyWithVideoNote(user.videoNoteId, {
    ...Markup.inlineKeyboard([
      Markup.button.callback(i18n.t('matchmaking.like'), MatchmakingAction.like),
      Markup.button.callback(i18n.t('matchmaking.dislike'), MatchmakingAction.dislike),
      Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
    ]),
  });
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
