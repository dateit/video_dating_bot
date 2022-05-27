import { Markup, Scenes } from 'telegraf';

import { getLiked, createLike, markLikeAsMutual, markLikeAsDisliked, getLikesCount } from '../services/likes';
import { findUnmatchedUser, updateUser } from '../services/user';
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
  const { i18n, user: contextUser, scene, from } = context;

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

  if (!user.surveyWasShown) {
    const likesCount = await getLikesCount(user.id);

    if (likesCount >= 10) {
      await context.replyWithLocalization('matchmaking.survey');
      await updateUser(from.id, { surveyWasShown: true });
    }
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

  const like = await getLiked(likedId, user.id);

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
  const { user, scene } = context;

  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  const likedId = (scene.state as IMatchmakingState).userId;

  const like = await getLiked(likedId, user.id);

  if (like) {
    await markLikeAsDisliked(like.id);
  } else {
    await createLike(user.id, likedId, true);
  }

  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.returnToProfile, async context => {
  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);
  await context.scene.enter(Scene.Profile);
});
