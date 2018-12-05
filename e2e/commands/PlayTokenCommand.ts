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
    return m.playableColumn[this.columnIdx];
  }
  async run(m: Model, driver: WebDriver) {
    // Act
    await Grid.tryPlayAt(driver, this.columnIdx);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(m.history.grids[m.history.cursor], newGrid).map(({ row, ...others }) => others);
    expect(differences).toEqual([{ col: this.columnIdx, from: null, to: m.currentPlayer }]); // only one token at a time: on clicked column, on previously empty, with right player

    // Update model
    m.history.cursor += 1;
    m.history.grids = [...m.history.grids.slice(0, m.history.cursor), newGrid];
    m.playableColumn = await Grid.readPlayable(driver);
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `PlayToken[${this.columnIdx}]`;
  }
}
