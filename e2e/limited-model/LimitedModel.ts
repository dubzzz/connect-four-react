import { WebDriver } from 'selenium-webdriver';
import { GridType, Player } from '../types';

export type LimitedModel = {
  currentPlayer: Player;
  driver: WebDriver;
  history: { [url: string]: { grid: GridType; player: Player } };
};
