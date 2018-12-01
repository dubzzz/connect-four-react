import * as assert from 'assert';
import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { WebDriver } from 'selenium-webdriver';
import { Instructions } from '../components/Instructions';
import { Grid } from '../components/Grid';

/**
 * Whenever there is no more moves available (except full grid)
 * Check that the displayed winner is the previous player (last one that played)
 */
export class CheckEndOfGameCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    return m.playableColumn.indexOf(true) === -1 && Grid.isFull(m.grid);
  }
  async run(m: Model, driver: WebDriver) {
    // Act

    // Assert
    const previousPlayer = m.currentPlayer === 0 ? 1 : 0;
    const label = await Instructions.read(driver);
    const expectedLabel = `Player #${previousPlayer + 1} won`;
    assert.equal(label, expectedLabel);

    // Update model
  }
  toString(): string {
    return `CheckEndOfGameCommand`;
  }
}
