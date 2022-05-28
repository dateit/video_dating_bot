import { Role } from '@prisma/client';

import { IContext } from '../types';

export const adminHandler = async (context: IContext) => {
  if (context.user.role !== Role.ADMIN) {
    return;
  }

  context.replyWithLocalization('admin.text');
};
