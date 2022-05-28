import { IContext } from '../types';

export const helpHandler = async (context: IContext) => {
  await context.replyWithLocalization('help.text');
};
