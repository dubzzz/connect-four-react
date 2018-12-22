import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';

/**
 * Saving the url for future use
 */
export class SaveUrlCommand implements AsyncCommand<LimitedModel, WebDriver> {
  check(m: Readonly<LimitedModel>) {
    return true;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const url = await driver.getCurrentUrl();
    const grid = await Grid.read(driver);

    // Assert
    const historyEntry = { grid, player: m.currentPlayer };
    if (m.history[url] != null) {
      expect(m.history[url]).toEqual(historyEntry);
    }

    // Update model
    m.history[url] = historyEntry;
  }
  toString(): string {
    return `SaveUrl`;
  }
}
