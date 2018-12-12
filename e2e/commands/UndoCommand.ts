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
    return !Grid.isEmpty(m.history.state[m.history.cursor].grid);
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    const previousUrl = await driver.getCurrentUrl();
    await Controls.undo(driver);

    // Assert
    const url = await driver.getCurrentUrl();
    const newGrid = await Grid.read(driver);
    const newPlayable = await Grid.readPlayable(driver);
    const differences = Grid.diff(m.history.state[m.history.cursor - 1].grid, newGrid);
    expect(differences).toEqual([]); // identical to the grid right before the last move
    expect(newPlayable).toEqual(m.history.state[m.history.cursor - 1].playable); // identical to playable right before the last move
    expect(url).not.toEqual(previousUrl);

    // Update model
    m.history.cursor -= 1;
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `Undo`;
  }
}
