import * as assert from 'assert';
import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../components/Grid';
import { WebDriver } from 'selenium-webdriver';
import { Controls } from '../components/Controls';

/**
 * Whenever there is at least one token in the grid, the user should be able to undo
 * Clicking on undo button undoes the move
 */
export class UndoCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    const currentGrid = m.history.grids[m.history.cursor];
    return currentGrid.find(vs => vs.find(e => e !== null) !== undefined) !== undefined;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Controls.undo(driver);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(m.history.grids[m.history.cursor - 1], newGrid);
    if (differences.length !== 0) {
      console.log(
        JSON.stringify({
          got: newGrid,
          expected: m.history.grids[m.history.cursor],
          differences
        })
      );
    }
    assert.equal(differences.length, 0, `identical to the grid right before the last move`);

    // Update model
    m.history.cursor -= 1;
    m.playableColumn = await Grid.readPlayable(driver);
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `Undo`;
  }
}
