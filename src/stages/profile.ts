import { Role } from '@prisma/client';
import { Markup, Scenes } from 'telegraf';

import { formatGender, formatLookingFor } from '../helpers/genders';
import { getUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum ProfileAction {
  myVideo = 'myVideo',
  startMatchmaking = 'startMatchmaking',
  editProfile = 'editProfile',
}

export const profileScene = new Scenes.BaseScene<IContext>(Scene.Profile);

profileScene.enter(async context => {
  const { i18n, from, user: contextUser, scene } = context;

  if (contextUser.role === Role.ANONYMOUS) {
    await context.replyWithLocalization('error.anonymous');

    return scene.leave();
  }

  const user = await getUser(from.id);

  await context.replyWithHTML(
    i18n.t('profile.main', {
      gender: formatGender(user.gender, context),
      lookingFor: formatLookingFor(user.lookingFor, context),
      age: user.age,
    }),
    Markup.inlineKeyboard([
      [Markup.button.callback(i18n.t('profile.start_matchmaking'), ProfileAction.startMatchmaking)],
      [
        Markup.button.callback(i18n.t('profile.my_video'), ProfileAction.myVideo),
        Markup.button.callback(i18n.t('profile.edit_profile'), ProfileAction.editProfile),
      ],
    ]),
  );
});

profileScene.action(ProfileAction.myVideo, async context => {
  await context.replyWithVideoNote(context.user.videoNoteId);
});

profileScene.action(ProfileAction.startMatchmaking, async context => {
  await context.scene.enter(Scene.Matchmaking);
});

profileScene.action(ProfileAction.editProfile, async context => {
  // TODO: implement
  await context.replyWithLocalization('errors.WIP');
});
