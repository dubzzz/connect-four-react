import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';

/**
 * Whenever the column is not playable
 * Playing in the column should not impact the grid
 */
export class PlayForbiddenTokenCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  constructor(readonly columnIdx: number) {}
  async check(m: Readonly<LimitedModel>) {
    const playableColumns = await Grid.readPlayable(m.driver);
    return !playableColumns[this.columnIdx];
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    await Grid.tryPlayAt(driver, this.columnIdx);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(previousGrid, newGrid);
    expect(differences).toEqual([]);

    // Update model
  }
  toString(): string {
    return `PlayForbiddenToken[${this.columnIdx}]`;
  }
}
