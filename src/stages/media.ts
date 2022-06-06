import { Composer, Scenes } from 'telegraf';

import { createMedia } from '../services/media';
import { IContext } from '../types';

import { Scene } from './scenes';

interface IMediaWizardState {
  mediaType: string;
}

const mediaTypeHandler = new Composer<IContext>();

mediaTypeHandler.on('text', async context => {
  const { message, wizard } = context;

  (wizard.state as IMediaWizardState).mediaType = message.text;

  await context.replyWithLocalization('media.upload');

  return wizard.next();
});

const mediaContentHandler = new Composer<IContext>();

mediaContentHandler.on('video', async context => {
  const { message, i18n, wizard, scene } = context;

  const { video } = message;

  await createMedia({
    telegramMediaId: video.file_id,
    telegramMediaType: 'video',
    type: (wizard.state as IMediaWizardState).mediaType,
  });

  await context.replyWithMarkdownV2(
    i18n.t('media.uploaded', {
      id: video.file_id,
    }),
  );

  await scene.leave();

  await scene.enter(Scene.Profile);
});

mediaContentHandler.on('photo', async context => {
  const { message, i18n, wizard, scene } = context;

  const { photo } = message;

  const telegramMediaId = photo[photo.length - 1].file_id;

  await createMedia({
    telegramMediaId,
    telegramMediaType: 'photo',
    type: (wizard.state as IMediaWizardState).mediaType,
  });

  await context.replyWithMarkdownV2(
    i18n.t('media.uploaded', {
      id: telegramMediaId,
    }),
  );

  await scene.leave();

  await scene.enter(Scene.Profile);
});

export const MediaScene = new Scenes.WizardScene<IContext>(Scene.Media, mediaTypeHandler, mediaContentHandler);

MediaScene.enter(async context => {
  await context.replyWithLocalization('media.type');
});
