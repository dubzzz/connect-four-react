import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { WebDriver } from 'selenium-webdriver';
import { Instructions } from '../components/Instructions';

/**
 * Whenever there is at least one available playable column
 * Check that the information bar on top refer to the player that is supposed to play
 */
export class CheckPlayerTurnCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    return m.playableColumn.indexOf(true) !== -1;
  }
  async run(m: Model, driver: WebDriver) {
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
