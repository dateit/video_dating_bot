import { Scenes, Markup, Composer } from 'telegraf';
import { Gender, Role } from '@prisma/client';

import { ageValidator, getUser, updateUser } from '../services/user';
import { IContext } from '../types';
import { findMediaByType, findOneMediaByType } from '../services/media';

import { Scene } from './scenes';

const enum GenderAction {
  male = 'male',
  female = 'female',
}

const enum MainAction {
  continue = 'continue',
}

const buildLookingForKeyboard = (context: IContext) => {
  const { i18n } = context;

  return Markup.inlineKeyboard([
    Markup.button.callback(i18n.t('lookingFor.male'), GenderAction.male),
    Markup.button.callback(i18n.t('lookingFor.female'), GenderAction.female),
  ]);
};

const buildGenderKeyboard = (context: IContext) => {
  const { i18n } = context;

  return Markup.inlineKeyboard([
    Markup.button.callback(i18n.t('gender.male'), GenderAction.male),
    Markup.button.callback(i18n.t('gender.female'), GenderAction.female),
  ]);
};

const replyWithVideoGuide = async (context: IContext) => {
  const { from, i18n } = context;
  const user = await getUser(from.id);

  const gender = user.gender.toLowerCase();

  const videos = await findMediaByType(`${gender}_video`);

  if (videos.length > 0) {
    const medias = videos.map(video => ({
      type: 'video' as const,
      media: video.telegramMediaId,
    }));

    await context.replyWithMediaGroup(medias);
  }

  await context.replyWithHTML(i18n.t('welcome.attach_video_info'), {
    disable_web_page_preview: true,
    ...Markup.inlineKeyboard([Markup.button.callback(i18n.t('welcome.record_video'), MainAction.continue)]),
  });
};

const videoNoteHandler = new Composer<IContext>();

videoNoteHandler.action(MainAction.continue, async context => {
  const { i18n } = context;

  const video = await findOneMediaByType('welcome_video');

  await Promise.all([
    context.clearUpKeyboard(),
    context.replyWithVideo(video.telegramMediaId, {
      caption: i18n.t('welcome.attach_video_note'),
      parse_mode: 'HTML',
    }),
  ]);
});

videoNoteHandler.on('video_note', async context => {
  const { wizard, i18n, from, message } = context;

  if (message.video_note.duration < 10) {
    await context.replyWithLocalization('errors.video_duration');

    return;
  }

  const user = await updateUser(from.id, { videoNoteId: message.video_note.file_id });

  const gender = user.gender.toLowerCase();

  await context.replyWithLocalization(
    `welcome.finish_text_${gender}`,
    Markup.inlineKeyboard([Markup.button.callback(i18n.t('welcome.finish'), MainAction.continue)]),
  );

  return wizard.next();
});

videoNoteHandler.on('message', async context => {
  await context.replyWithLocalization('errors.video');
});

const finalStepHandler = new Composer<IContext>();

finalStepHandler.action(MainAction.continue, async context => {
  const { scene, from } = context;

  await context.clearUpKeyboard();

  context.user = await updateUser(from.id, { role: Role.USER });

  await scene.leave();

  await scene.enter(Scene.Matchmaking);
});

const genderHandler = new Composer<IContext>();

genderHandler.action(MainAction.continue, async context => {
  await Promise.all([
    context.clearUpKeyboard(),
    context.replyWithLocalization('welcome.gender', buildGenderKeyboard(context)),
  ]);
});

genderHandler.action(GenderAction.male, async context => {
  const { wizard, from } = context;

  await context.clearUpKeyboard();

  await updateUser(from.id, { gender: Gender.MALE });

  await context.replyWithLocalization('welcome.lookingFor', buildLookingForKeyboard(context));

  return wizard.next();
});

genderHandler.action(GenderAction.female, async context => {
  const { wizard, from } = context;

  await context.clearUpKeyboard();

  await updateUser(from.id, { gender: Gender.FEMALE });

  await context.replyWithLocalization('welcome.lookingFor', buildLookingForKeyboard(context));

  return wizard.next();
});

const lookingForHandler = new Composer<IContext>();
lookingForHandler.action(GenderAction.male, async context => {
  const { wizard, from } = context;

  await context.clearUpKeyboard();

  await updateUser(from.id, { lookingFor: Gender.MALE });

  await context.replyWithLocalization('welcome.age');

  return wizard.next();
});

lookingForHandler.action(GenderAction.female, async context => {
  const { wizard, from } = context;

  await context.clearUpKeyboard();

  await updateUser(from.id, { lookingFor: Gender.FEMALE });

  await context.replyWithLocalization('welcome.age');

  return wizard.next();
});

const ageHandler = new Composer<IContext>();

ageHandler.on('text', async context => {
  const { message, wizard, from } = context;

  const age = Number(message.text);

  if (ageValidator.validate(age).error) {
    await context.replyWithLocalization('errors.age');

    return;
  }

  await updateUser(from.id, { age });

  await replyWithVideoGuide(context);

  return wizard.next();
});

export const welcomeScene = new Scenes.WizardScene<IContext>(
  Scene.Welcome,
  genderHandler,
  lookingForHandler,
  ageHandler,
  videoNoteHandler,
  finalStepHandler,
);

welcomeScene.enter(async context => {
  const { i18n } = context;

  const photo = await findOneMediaByType('welcome_photo');

  await context.replyWithPhoto(photo.telegramMediaId, {
    caption: i18n.t('welcome.text'),
    ...Markup.inlineKeyboard([Markup.button.callback(i18n.t('welcome.continue'), MainAction.continue)]),
  });
});
