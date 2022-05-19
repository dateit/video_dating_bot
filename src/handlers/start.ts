import { Role } from '@prisma/client';

import { Scene } from '../stages/scenes';
import { IContext } from '../types';

export const startHandler = async (context: IContext) => {
  if (context.user.role !== Role.ANONYMOUS) {
    await context.scene.enter(Scene.Profile);

    return;
  }

  await context.scene.enter(Scene.Welcome);
};
