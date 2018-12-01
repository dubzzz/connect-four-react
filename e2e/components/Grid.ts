import { WebDriver, By } from 'selenium-webdriver';
import { PlayerOrEmpty } from '../Model';
import { hasClass } from './helpers';

export class Grid {
  static async allPlayable(driver: WebDriver) {
    const gridColumns = await driver.findElements(By.className('board-column'));
    return gridColumns.map(_ => true);
  }
  static async emptyGrid(driver: WebDriver) {
    const gridColumns = await driver.findElements(By.className('board-column'));
    const gridLines = await gridColumns[0].findElements(By.className('board-cell'));
    const grid: PlayerOrEmpty[][] = [];
    for (let col = 0; col !== gridColumns.length; ++col) {
      grid.push(gridLines.map(_ => null));
    }
    return grid;
  }
  static async tryPlayAt(driver: WebDriver, columnIdx: number) {
    const gridColumns = await driver.findElements(By.className('board-column'));
    await gridColumns[columnIdx].click();
  }
  static async readPlayable(driver: WebDriver) {
    const gridColumns = await driver.findElements(By.className('board-column'));
    return Promise.all(gridColumns.map(col => hasClass(col, 'playable')));
  }
  static async read(driver: WebDriver) {
    // Rely on executeAsyncScript instead of multiple asynchronous calls to selenium
    // for better performances
    return (await driver.executeAsyncScript(function(done: any) {
      const grid: PlayerOrEmpty[][] = [];
      const gridColumns = document.getElementsByClassName('board-column');
      for (const col of gridColumns) {
        const tokensEl = col.getElementsByClassName('board-cell');
        const tokens = [...tokensEl].map(el => {
          const classes = el.className.split(' ');
          if (classes.indexOf('player-') !== -1) return null;
          if (classes.indexOf('player-1') !== -1) return 0;
          else return 1;
        });
        grid.push(tokens);
      }
      done(grid);
    })) as PlayerOrEmpty[][];
  }
  static diff(gridFrom: PlayerOrEmpty[][], gridTo: PlayerOrEmpty[][]) {
    const differences: { row: number; col: number; from: PlayerOrEmpty; to: PlayerOrEmpty }[] = [];
    for (let col = 0; col !== gridFrom.length; ++col) {
      for (let row = 0; row !== gridFrom[col].length; ++row) {
        if (gridFrom[col][row] !== gridTo[col][row])
          differences.push({ row, col, from: gridFrom[col][row], to: gridTo[col][row] });
      }
    }
    return differences;
  }
  static isFull(grid: PlayerOrEmpty[][]) {
    for (let col = 0; col !== grid.length; ++col) {
      for (let row = 0; row !== grid[col].length; ++row) {
        if (grid[col][row] === null) return false;
      }
    }
    return true;
  }
}
