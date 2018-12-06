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
    return m.history.cursor + 1 < m.history.state.length;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Controls.redo(driver);

    // Assert
    const newGrid = await Grid.read(driver);
    const newPlayable = await Grid.readPlayable(driver);
    const differences = Grid.diff(m.history.state[m.history.cursor + 1].grid, newGrid);
    expect(differences).toEqual([]); // identical to the grid right before the undo
    expect(newPlayable).toEqual(m.history.state[m.history.cursor + 1].playable); // identical to playable before undo

    // Update model
    m.history.cursor += 1;
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `Undo`;
  }
}
