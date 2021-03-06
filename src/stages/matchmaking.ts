import { Markup, Scenes } from 'telegraf';

import {
  getLiked,
  createLike,
  markLikeAsMutual,
  markLikeAsDisliked,
  getLikesCount,
  createDislike,
} from '../services/likes';
import { createReport } from '../services/report';
import { findUnmatchedUser, updateUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum MatchmakingAction {
  like = 'like',
  dislike = 'dislike',
  returnToProfile = 'returnToProfile',
  report = 'report',
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

  await context.replyWithVideoNote(user.videoNoteId, {
    protect_content: true,
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback(i18n.t('matchmaking.like'), MatchmakingAction.like),
        Markup.button.callback(i18n.t('matchmaking.dislike'), MatchmakingAction.dislike),
      ],
      [
        Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
        Markup.button.callback(i18n.t('matchmaking.report'), MatchmakingAction.report),
      ],
    ]),
  });
};

matchmakingScene.enter(async context => {
  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.like, async context => {
  const { user, scene, i18n, telegram } = context;

  await context.clearUpKeyboard();

  const likedId = (scene.state as IMatchmakingState).userId;

  const like = await getLiked(likedId, user.id);

  if (!like) {
    await createLike(user.id, likedId);

    await replyWithNewMatch(context);

    return;
  }

  const { liker, id } = like;

  const genderLiker = liker.gender.toLocaleLowerCase();
  const messageLiker = Boolean(liker.username)
    ? i18n.t(`matchmaking.match_${genderLiker}`, {
        username: liker.username,
      })
    : i18n.t(`matchmaking.id_match_${genderLiker}`, {
        telegramId: liker.telegramId,
      });

  const genderLiked = user.gender.toLocaleLowerCase();
  const messageLiked = Boolean(user.username)
    ? i18n.t(`matchmaking.match_${genderLiked}`, {
        username: user.username,
      })
    : i18n.t(`matchmaking.id_match_${genderLiked}`, {
        telegramId: user.telegramId,
      });

  await Promise.all([
    markLikeAsMutual(id),
    telegram.sendMessage(liker.telegramChatId, messageLiked, { parse_mode: 'HTML' }),
    context.replyWithHTML(
      messageLiker,
      Markup.inlineKeyboard([
        Markup.button.callback(i18n.t('matchmaking.return_to_profile'), MatchmakingAction.returnToProfile),
      ]),
    ),
  ]);
});

matchmakingScene.action(MatchmakingAction.dislike, async context => {
  const { user, scene } = context;

  await context.clearUpKeyboard();

  const likedId = (scene.state as IMatchmakingState).userId;

  const like = await getLiked(likedId, user.id);

  if (like) {
    await markLikeAsDisliked(like.id);
  } else {
    await createDislike(user.id, likedId);
  }

  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.report, async context => {
  const { user, scene } = context;

  await context.clearUpKeyboard();

  const likedId = (scene.state as IMatchmakingState).userId;

  await Promise.all([createReport(user.id, likedId), context.replyWithLocalization('matchmaking.report_sent')]);

  await replyWithNewMatch(context);
});

matchmakingScene.action(MatchmakingAction.returnToProfile, async context => {
  await context.clearUpKeyboard();
  await context.scene.enter(Scene.Profile);
});
