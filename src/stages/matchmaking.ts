import { Markup, Scenes } from 'telegraf';

import { getMutualLiked, createLike, markLikeAsMutual } from '../services/likes';
import { findUnmatchedUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum MatchmakingAction {
  like = 'like',
  dislike = 'dislike',
  returnToProfile = 'returnToProfile',
}

interface IMatchmakingState {
  userId: string;
}

export const matchmakingScene = new Scenes.BaseScene<IContext>(Scene.Matchmaking);

const replyWithNewMatch = async (context: IContext) => {
  const { i18n, user: contextUser, scene } = context;

  const user = await findUnmatchedUser(contextUser);

  if (!user) {
    await context.replyWithLocalization(
      'matchmaking.no_users',
      Markup.inlineKeyboard([
        Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
      ]),
    );

    return;
  }

  scene.state = {
    userId: user.id,
  } as IMatchmakingState;

  await context.replyWithVideoNote(
    user.videoNoteId,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(i18n.t('matchmaking.like'), MatchmakingAction.like),
        Markup.button.callback(i18n.t('matchmaking.dislike'), MatchmakingAction.dislike),
      ],
      [Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile)],
    ]),
  );
};

matchmakingScene.enter(async context => {
  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.like, async context => {
  const { user, scene, i18n } = context;

  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  const likedId = (scene.state as IMatchmakingState).userId;

  const like = await getMutualLiked(likedId, user.id);

  if (!like) {
    await createLike(user.id, likedId);

    await replyWithNewMatch(context);

    return;
  }

  await markLikeAsMutual(like.id);

  await context.replyWithHTML(
    i18n.t('matchmaking.match', {
      username: like.liker.username,
    }),
    Markup.inlineKeyboard([
      Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
    ]),
  );
});

matchmakingScene.action(MatchmakingAction.dislike, async context => {
  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  await createLike(context.user.id, (context.scene.state as IMatchmakingState).userId, true);

  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.returnToProfile, async context => {
  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);
  await context.scene.enter(Scene.Profile);
});
