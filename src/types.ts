import { User } from '@prisma/client';
import I18n from 'telegraf-i18n';
import { Context as TelegrafContext, Scenes, Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Message } from 'typegram';

export type ISession = Scenes.WizardSession;

export interface IContext extends TelegrafContext {
  i18n: I18n;
  replyWithLocalization: (resourceKey: string, extra?: ExtraReplyMessage) => Promise<Message>;

  user: User;

  session: ISession;
  scene: Scenes.SceneContextScene<IContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<IContext>;
}

export type TelegrafInstance = Telegraf<IContext>;
