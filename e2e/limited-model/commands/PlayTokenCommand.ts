import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';

/**
 * Whenever the column is playable
 * Playing in the column should add a token into it
 */
export class PlayTokenCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  constructor(readonly columnIdx: number) {}
  async check(m: Readonly<LimitedModel>) {
    const playableColumns = await Grid.readPlayable(m.driver);
    return playableColumns[this.columnIdx];
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    await Grid.tryPlayAt(driver, this.columnIdx);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(previousGrid, newGrid).map(({ row, ...others }) => others);
    expect(differences).toEqual([{ col: this.columnIdx, from: null, to: m.currentPlayer }]);

    // Update model
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `PlayToken[${this.columnIdx}]`;
  }
}
