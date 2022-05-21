import { Role, User } from '@prisma/client';
import { Markup, Scenes } from 'telegraf';
import { ExtraEditMessageText, ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { formatGender, formatLookingFor } from '../helpers/genders';
import { getUser, updateUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const enum ProfileAction {
  myVideo = 'myVideo',
  startMatchmaking = 'startMatchmaking',
  editProfile = 'editProfile',
  profile = 'profile',
  profileReply = 'profileReply',
  matched = 'matched',
  changeVideo = 'changeVideo',
  changeAge = 'changeAge',

  changeGender = 'changeGender',
  changeGenderMale = 'changeGenderMale',
  changeGenderFemale = 'changeGenderFemale',

  changeLookingFor = 'changeLookingFor',
  changeLookingForMale = 'changeLookingForMale',
  changeLookingForFemale = 'changeLookingForFemale',
}

const replyWithProfile = (context: IContext, user: User, extra: ExtraReplyMessage) => {
  const { i18n } = context;

  return context.replyWithHTML(
    i18n.t('profile.main', {
      gender: formatGender(user.gender, context),
      lookingFor: formatLookingFor(user.lookingFor, context),
      age: user.age,
    }),
    extra,
  );
};

const editMessageWithProfile = (context: IContext, extra: ExtraEditMessageText) => {
  const { i18n, user } = context;

  return context.editMessageText(
    i18n.t('profile.main', {
      gender: formatGender(user.gender, context),
      lookingFor: formatLookingFor(user.lookingFor, context),
      age: user.age,
    }),
    { parse_mode: 'HTML', ...extra },
  );
};

const buildProfileMainKeyboard = (context: IContext) => {
  const { i18n } = context;

  return Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t('profile.start_matchmaking'), ProfileAction.startMatchmaking)],
    [
      Markup.button.callback(i18n.t('profile.my_video'), ProfileAction.myVideo),
      Markup.button.callback(i18n.t('profile.edit_profile'), ProfileAction.editProfile),
    ],
  ]);
};

export const profileScene = new Scenes.BaseScene<IContext>(Scene.Profile);

export const changeVideoScene = new Scenes.BaseScene<IContext>(Scene.EditVideo);

export const changeAgeScene = new Scenes.BaseScene<IContext>(Scene.EditAge);

profileScene.enter(async context => {
  const { from, user: contextUser, scene } = context;

  if (contextUser.role === Role.ANONYMOUS) {
    await context.replyWithLocalization('error.anonymous');

    return scene.leave();
  }

  const user = await getUser(from.id);

  return await replyWithProfile(context, user, buildProfileMainKeyboard(context));
});

profileScene.action(ProfileAction.myVideo, async context => {
  const { user, i18n } = context;

  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  await context.replyWithVideoNote(
    user.videoNoteId,
    Markup.inlineKeyboard([
      Markup.button.callback(i18n.t('edit_profile.change_video'), ProfileAction.changeVideo),
      Markup.button.callback(i18n.t('edit_profile.back'), ProfileAction.profileReply),
    ]),
  );
});

profileScene.action(ProfileAction.startMatchmaking, async context => {
  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  await context.scene.enter(Scene.Matchmaking);
});

profileScene.action(ProfileAction.editProfile, async context => {
  const { i18n } = context;

  return await editMessageWithProfile(
    context,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(i18n.t('edit_profile.change_gender'), ProfileAction.changeGender),
        Markup.button.callback(i18n.t('edit_profile.change_looking_for'), ProfileAction.changeLookingFor),
      ],
      [
        Markup.button.callback(i18n.t('edit_profile.change_age'), ProfileAction.changeAge),
        Markup.button.callback(i18n.t('profile.return_to_profile'), ProfileAction.profile),
      ],
    ]),
  );
});

profileScene.action(ProfileAction.changeVideo, async context => {
  const { i18n, scene } = context;
  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  await context.replyWithLocalization(
    'edit_profile.video',
    Markup.inlineKeyboard([Markup.button.callback(i18n.t('profile.return_to_profile'), ProfileAction.profileReply)]),
  );

  await scene.enter(Scene.EditVideo);
});

changeVideoScene.on('video_note', async context => {
  const { scene, from, message } = context;

  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  await updateUser(from.id, { videoNoteId: message.video_note.file_id });

  await scene.enter(Scene.Profile);
});

profileScene.action(ProfileAction.changeGender, async context => {
  const { i18n } = context;

  return await editMessageWithProfile(
    context,
    Markup.inlineKeyboard([
      Markup.button.callback(i18n.t('gender.male'), ProfileAction.changeGenderMale),
      Markup.button.callback(i18n.t('gender.female'), ProfileAction.changeGenderFemale),
    ]),
  );
});

profileScene.action(ProfileAction.changeLookingFor, async context => {
  const { i18n } = context;

  return await editMessageWithProfile(
    context,
    Markup.inlineKeyboard([
      Markup.button.callback(i18n.t('gender.male'), ProfileAction.changeLookingForMale),
      Markup.button.callback(i18n.t('gender.female'), ProfileAction.changeLookingForFemale),
    ]),
  );
});

profileScene.action(ProfileAction.profile, async context => {
  return await editMessageWithProfile(context, buildProfileMainKeyboard(context));
});

profileScene.action(ProfileAction.profileReply, async context => {
  const { user } = context;

  await context.editMessageReplyMarkup(Markup.inlineKeyboard([]).reply_markup);

  return await replyWithProfile(context, user, buildProfileMainKeyboard(context));
});
