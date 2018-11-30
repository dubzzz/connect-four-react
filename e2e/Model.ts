import { WebDriver } from 'selenium-webdriver';

export type Player = 0 | 1;
export type PlayerOrEmpty = Player | null;

export type Model = {
  playableColumn: boolean[];
  grid: PlayerOrEmpty[][];
  currentPlayer: Player;
};
