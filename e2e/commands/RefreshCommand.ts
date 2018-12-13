import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../components/Grid';
import { WebDriver } from 'selenium-webdriver';

/**
 * Refreshing the page should lead to the exact same state
 */
export class RefreshCommand implements AsyncCommand<Model, WebDriver> {
  check(m: Readonly<Model>): boolean {
    return true;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    const previousUrl = await driver.getCurrentUrl();
    await driver.navigate().refresh();

    // Assert
    const url = await driver.getCurrentUrl();
    const newGrid = await Grid.read(driver);
    const newPlayable = await Grid.readPlayable(driver);
    const differences = Grid.diff(m.history.state[m.history.cursor].grid, newGrid);
    expect(differences).toEqual([]);
    expect(newPlayable).toEqual(m.history.state[m.history.cursor].playable);
    expect(url).not.toEqual(previousUrl);

    // Update model
  }
  toString(): string {
    return `Refresh`;
  }
}
