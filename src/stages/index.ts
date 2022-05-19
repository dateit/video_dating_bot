import { Scenes } from 'telegraf';

import { IContext } from '../types';

import { matchmakingScene } from './matchmaking';
import { profileScene } from './profile';
import { welcomeScene } from './welcome';

export const stage = new Scenes.Stage<IContext>([welcomeScene, profileScene, matchmakingScene]);
