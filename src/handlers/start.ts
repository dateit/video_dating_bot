import { Role } from '@prisma/client';

import { setUserCommand } from '../helpers/commands';
import { Scene } from '../stages/scenes';
import { IContext } from '../types';

export const startHandler = async (context: IContext) => {
  await setUserCommand(context);

  if (context.user.role !== Role.ANONYMOUS) {
    await context.scene.enter(Scene.Profile);

    return;
  }

  await context.scene.enter(Scene.Welcome);
};
