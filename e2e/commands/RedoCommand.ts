import * as assert from 'assert';
import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../components/Grid';
import { WebDriver } from 'selenium-webdriver';
import { Controls } from '../components/Controls';

/**
 * Whenever there is at least one canceled move, the user should be able to redo it
 * Clicking on redo button redoes the move
 */
export class RedoCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    return m.history.cursor + 1 < m.history.grids.length;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Controls.redo(driver);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(m.history.grids[m.history.cursor + 1], newGrid);
    if (differences.length !== 0) {
      console.log(
        JSON.stringify({
          got: newGrid,
          expected: m.history.grids[m.history.cursor + 1],
          differences
        })
      );
    }
    assert.equal(differences.length, 0, `identical to the grid right before the undo`);

    // Update model
    m.history.cursor += 1;
    m.playableColumn = await Grid.readPlayable(driver);
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `Undo`;
  }
}
