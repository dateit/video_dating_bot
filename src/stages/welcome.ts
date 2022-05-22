import { Scenes, Markup, Composer } from 'telegraf';
import { Gender, Role } from '@prisma/client';

import { ageValidator, updateUser } from '../services/user';
import { IContext } from '../types';

import { Scene } from './scenes';

const videoNoteHandler = new Composer<IContext>();
videoNoteHandler.on('video_note', async context => {
  const { i18n, wizard, from, message } = context;

  const selectGenderKeyboard = Markup.inlineKeyboard([
    Markup.button.callback(i18n.t('gender.male'), GenderAction.male),
    Markup.button.callback(i18n.t('gender.female'), GenderAction.male),
  ]);

  await updateUser(from.id, { videoNoteId: message.video_note.file_id });

  await context.reply(i18n.t('welcome.gender'), selectGenderKeyboard);

  return wizard.next();
});

const enum GenderAction {
  male = 'male',
  female = 'female',
}

const genderHandler = new Composer<IContext>();

genderHandler.action(GenderAction.male, async context => {
  const { i18n, wizard, from } = context;

  await context.editMessageText(i18n.t('welcome.gender'));

  await updateUser(from.id, { gender: Gender.MALE, lookingFor: Gender.FEMALE, role: Role.USER });

  await context.replyWithLocalization('welcome.age');

  return wizard.next();
});

genderHandler.action(GenderAction.female, async context => {
  const { i18n, wizard, from } = context;

  await context.editMessageText(i18n.t('welcome.gender'));

  await updateUser(from.id, { gender: Gender.FEMALE, lookingFor: Gender.MALE, role: Role.USER });

  await context.replyWithLocalization('welcome.age');

  return wizard.next();
});

const ageHandler = new Composer<IContext>();
ageHandler.on('text', async context => {
  const { message, scene, from } = context;

  const age = Number(message.text);

  if (ageValidator.validate(age).error) {
    await context.replyWithLocalization('errors.age');

    return;
  }

  await updateUser(from.id, { age });

  await scene.leave();

  await scene.enter(Scene.Profile);
});

export const welcomeScene = new Scenes.WizardScene<IContext>(
  Scene.Welcome,
  videoNoteHandler,
  genderHandler,
  ageHandler,
);

welcomeScene.enter(async context => {
  await context.replyWithLocalization('welcome.attach_video_note');
});
