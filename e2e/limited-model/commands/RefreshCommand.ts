import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';

/**
 * Refreshing the current page should lead to the same grid
 */
export class RefreshCommand implements AsyncCommand<LimitedModel, WebDriver> {
  check(m: Readonly<LimitedModel>) {
    return true;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    await driver.navigate().refresh();

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(previousGrid, newGrid);
    expect(differences).toEqual([]);

    // Update model
  }
  toString(): string {
    return `Refresh`;
  }
}
