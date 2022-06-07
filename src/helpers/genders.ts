import { IContext } from '../types';

export const formatGender = (gender: string | null, context: IContext) => {
  if (!gender) {
    return 'EMPTY';
  }

  const formattedGender = gender.toLocaleLowerCase();

  return context.i18n.t(`gender.${formattedGender}`);
};

export const formatLookingFor = (gender: string | null, context: IContext) => {
  if (!gender) {
    return 'EMPTY';
  }

  const formattedGender = gender.toLocaleLowerCase();

  return context.i18n.t(`lookingFor.${formattedGender}`);
};
