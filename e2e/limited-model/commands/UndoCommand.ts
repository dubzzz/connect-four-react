import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Controls } from '../../components/Controls';

/**
 * Whenever there is at least one token in the grid
 * Undoing revert one move
 */
export class UndoCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  async check(m: Readonly<LimitedModel>) {
    const grid = await Grid.read(m.driver);
    return !Grid.isEmpty(grid);
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    expect(await Controls.canUndo(driver)).toBe(true);
    await Controls.undo(driver);

    // Assert
    const previousPlayer = m.currentPlayer === 0 ? 1 : 0;
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(previousGrid, newGrid);
    expect(differences).toHaveLength(1);
    expect(differences.filter(d => d.from === previousPlayer && d.to === null)).toHaveLength(1);
    expect(await Controls.canRedo(driver)).toBe(true);

    // Update model
    m.currentPlayer = previousPlayer;
  }
  toString(): string {
    return `Undo`;
  }
}
