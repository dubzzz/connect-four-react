import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../components/Grid';
import { WebDriver } from 'selenium-webdriver';
import { Controls } from '../components/Controls';

/**
 * Clicking on new game button restarts the game
 * without changing the current player
 */
export class NewGameCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    return true;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Controls.newGame(driver);

    // Assert
    // No real need to assert something there we can let other commands
    // relying on our dreamt model do the checks for us

    // Update model
    m.grid = await Grid.emptyGrid(driver);
    m.playableColumn = await Grid.allPlayable(driver);
  }
  toString(): string {
    return `NewGame`;
  }
}
