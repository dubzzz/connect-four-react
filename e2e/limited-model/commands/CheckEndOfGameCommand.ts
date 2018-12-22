import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Instructions } from '../../components/Instructions';

/**
 * Whenever there is no more move allowed
 * The right player should be indicated in the top bar:
 * either the winner or the 'next' player
 */
export class CheckEndOfGameCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  async check(m: Readonly<LimitedModel>) {
    const playableColumns = await Grid.readPlayable(m.driver);
    return playableColumns.indexOf(true) === -1;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act

    // Assert
    const previousPlayer = m.currentPlayer === 0 ? 1 : 0;
    const grid = await Grid.read(driver);
    const label = await Instructions.read(driver);
    const expectedPlayerWonLabel = `Player #${previousPlayer + 1} won`;
    const expectedPlayerTurnLabel = `Player #${m.currentPlayer + 1} turn`;
    if (Grid.isFull(grid)) {
      expect([expectedPlayerTurnLabel, expectedPlayerWonLabel]).toContain(label);
    } else {
      expect(label).toEqual(expectedPlayerWonLabel);
    }

    // Update model
  }
  toString(): string {
    return `CheckEndOfGame`;
  }
}
