import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Controls } from '../../components/Controls';

/**
 * Pressing 'new game' restart the game (empty grid of same dimensions)
 */
export class NewGameCommand implements AsyncCommand<LimitedModel, WebDriver> {
  check(m: Readonly<LimitedModel>) {
    return true;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    await Controls.newGame(driver);

    // Assert
    const newGrid = await Grid.read(driver);
    const emptyGrid = Grid.emptyGrid(previousGrid[0].length, previousGrid.length);
    const differences = Grid.diff(emptyGrid, newGrid);
    expect(differences).toEqual([]);

    // Update model
  }
  toString(): string {
    return `NewGame`;
  }
}
