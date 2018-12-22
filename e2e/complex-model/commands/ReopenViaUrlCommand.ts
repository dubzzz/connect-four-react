import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { WebDriver } from 'selenium-webdriver';

/**
 * Whenever there is at least one past url
 * Reopening this url should get the user back to the state seen for this url
 */
export class ReopenViaUrlCommand implements AsyncCommand<Model, WebDriver> {
  private url: string;
  constructor(readonly idx: number) {
    this.url = 'undefined url';
  }
  check(m: Readonly<Model>): boolean {
    return Object.keys(m.previouslySeenPaths).length > 0;
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    const knownPaths = Object.keys(m.previouslySeenPaths);
    this.url = knownPaths[this.idx % knownPaths.length];
    await driver.get(this.url);

    // Assert

    // Update model
    m.history.cursor = m.previouslySeenPaths[this.url].length - 1;
    m.history.state = m.previouslySeenPaths[this.url];
    m.currentPlayer = m.history.state[m.history.cursor].currentPlayer;
  }
  toString(): string {
    return `ReopenViaUrlCommand(${JSON.stringify(this.url)})`;
  }
}
