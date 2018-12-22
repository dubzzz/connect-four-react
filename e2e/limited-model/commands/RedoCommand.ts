import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Controls } from '../../components/Controls';

/**
 * Whenever redo button is accessible
 * Redoing add back a token
 */
export class RedoCommand implements AsyncCommand<LimitedModel, WebDriver, true> {
  async check(m: Readonly<LimitedModel>) {
    return await Controls.canRedo(m.driver);
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const previousGrid = await Grid.read(driver);
    await Controls.redo(driver);

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(previousGrid, newGrid);
    expect(differences).toHaveLength(1);
    expect(differences.filter(d => d.from === null && d.to === m.currentPlayer)).toHaveLength(1);
    expect(await Controls.canUndo(driver)).toBe(true);

    // Update model
    m.currentPlayer = m.currentPlayer === 0 ? 1 : 0;
  }
  toString(): string {
    return `Redo`;
  }
}
