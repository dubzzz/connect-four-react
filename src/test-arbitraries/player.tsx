import * as fc from 'fast-check';
import { Player } from '../models/player';

export const playerArb = fc.constantFrom(Player.PlayerA, Player.PlayerB);
export const playerOrNoneArb = fc.constantFrom(Player.None, Player.PlayerA, Player.PlayerB);
