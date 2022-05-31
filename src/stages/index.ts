import { Scenes } from 'telegraf';

import { IContext } from '../types';

import { adminScene } from './admin';
import { matchmakingScene } from './matchmaking';
import { profileScene, changeAgeScene, changeVideoScene } from './profile';
import { welcomeScene } from './welcome';

export const stage = new Scenes.Stage<IContext>([
  welcomeScene,
  profileScene,
  matchmakingScene,
  changeAgeScene,
  changeVideoScene,
  adminScene,
]);
