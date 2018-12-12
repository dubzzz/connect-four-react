import { AsyncCommand } from 'fast-check';
import { Model } from '../Model';
import { Grid } from '../components/Grid';
import { WebDriver } from 'selenium-webdriver';

/**
 * Whenever a column is considered playable
 * Clicking on it should at an additional token into it and change the current player
 */
export class PlayTokenCommand implements AsyncCommand<Model, WebDriver> {
  constructor(readonly columnIdx: number) {}
  check(m: Readonly<Model>): boolean {
    return m.history.state[m.history.cursor].playable[this.columnIdx];
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    const previousUrl = await driver.getCurrentUrl();
    await Grid.tryPlayAt(driver, this.columnIdx);

    // Assert
    const url = await driver.getCurrentUrl();
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(m.history.state[m.history.cursor].grid, newGrid).map(({ row, ...others }) => others);
    expect(differences).toEqual([{ col: this.columnIdx, from: null, to: m.currentPlayer }]); // only one token at a time: on clicked column, on previously empty, with right player
    expect(url).not.toEqual(previousUrl);

    // Update model
    const newPlayable = await Grid.readPlayable(driver);
    const newCurrentPlayer = m.currentPlayer === 0 ? 1 : 0;
    m.history.cursor += 1;
    m.history.state = [
      ...m.history.state.slice(0, m.history.cursor),
      { grid: newGrid, playable: newPlayable, currentPlayer: newCurrentPlayer }
    ];
    m.currentPlayer = newCurrentPlayer;
    m.previouslySeenPaths[url] = [...m.history.state];
  }
  toString(): string {
    return `PlayToken[${this.columnIdx}]`;
  }
}
