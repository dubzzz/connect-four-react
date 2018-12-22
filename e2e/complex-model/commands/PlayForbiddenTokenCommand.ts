import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../../components/Grid';
import { WebDriver } from 'selenium-webdriver';

/**
 * Whenever a column is considered not playable
 * Clicking on it should not affect the model
 */
export class PlayForbiddenTokenCommand implements AsyncCommand<Model, WebDriver> {
  constructor(readonly columnIdx: number) {}
  check(m: Readonly<Model>): boolean {
    return !m.history.state[m.history.cursor].playable[this.columnIdx];
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Grid.tryPlayAt(driver, this.columnIdx);

    // Assert
    const newGrid = await Grid.read(driver);
    const newPlayableColumn = await Grid.readPlayable(driver);
    expect(newGrid).toEqual(m.history.state[m.history.cursor].grid); // no modification of the grid
    expect(newPlayableColumn).toEqual(m.history.state[m.history.cursor].playable); // no modification of the playable areas

    // Update model
  }
  toString(): string {
    return `PlayForbiddenToken[${this.columnIdx}]`;
  }
}
