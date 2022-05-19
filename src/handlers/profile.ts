import { Scene } from '../stages/scenes';
import { IContext } from '../types';

export const profileHandler = async (context: IContext) => {
  await context.scene.enter(Scene.Profile);
};
