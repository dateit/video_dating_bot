import { Role } from '@prisma/client';

import { Scene } from '../stages/scenes';
import { IContext } from '../types';

export const adminHandler = async (context: IContext) => {
  if (context.user.role !== Role.ADMIN) {
    return;
  }

  await context.scene.enter(Scene.Admin);
};
