import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';

/**
 * Saving the url for future use
 */
export class ReopenViaUrlCommand implements AsyncCommand<LimitedModel, WebDriver> {
  private url: string;
  constructor(readonly idx: number) {
    this.url = 'undefined url';
  }
  check(m: Readonly<LimitedModel>) {
    return Object.keys(m.history).length > 0;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const knownPaths = Object.keys(m.history);
    this.url = knownPaths[this.idx % knownPaths.length];
    await driver.get(this.url);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(m.history[this.url].grid, newGrid);
    expect(differences).toHaveLength(0);

    // Update model
    m.currentPlayer = m.history[this.url].player;
  }
  toString(): string {
    return `ReopenViaUrl[${this.url}]`;
  }
}
