import { IContext } from '../types';

export const formatGender = (gender: string, context: IContext) => {
  const formattedGender = gender.toLocaleLowerCase();

  return context.i18n.t(`gender.${formattedGender}`);
};

export const formatLookingFor = (gender: string, context: IContext) => {
  const formattedGender = gender.toLocaleLowerCase();

  return context.i18n.t(`lookingFor.${formattedGender}`);
};
