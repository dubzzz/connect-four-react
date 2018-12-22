import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Instructions } from '../../components/Instructions';

/**
 * Whenever there is at least one move possible
 * The right player should be indicated in the top bar
 */
export class CheckPlayerTurnCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  async check(m: Readonly<LimitedModel>) {
    const playableColumns = await Grid.readPlayable(m.driver);
    return playableColumns.indexOf(true) !== -1;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act

    // Assert
    const label = await Instructions.read(driver);
    const expectedLabel = `Player #${m.currentPlayer + 1} turn`;
    expect(label).toEqual(expectedLabel);

    // Update model
  }
  toString(): string {
    return `CheckPlayerTurn`;
  }
}
