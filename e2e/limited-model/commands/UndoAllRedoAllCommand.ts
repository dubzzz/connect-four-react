import { AsyncCommand } from 'fast-check';
import { WebDriver } from 'selenium-webdriver';
import { LimitedModel } from '../LimitedModel';
import { Grid } from '../../components/Grid';
import { Controls } from '../../components/Controls';

/**
 * Undoing all then redoing all must remove and add the tokens in the right order
 */
export class UndoAllRedoAllCommand implements AsyncCommand<LimitedModel, WebDriver> {
  check(m: Readonly<LimitedModel>) {
    return true;
  }
  async run(m: LimitedModel, driver: WebDriver) {
    // Act
    const undoDifferences = [];
    const redoDifferences = [];
    const initialGrid = await Grid.read(driver);
    let previousGrid = initialGrid;
    while (await Controls.canUndo(driver)) {
      // undo all
      await Controls.undo(driver);
      const newGrid = await Grid.read(driver);
      const differences = Grid.diff(previousGrid, newGrid);
      undoDifferences.push(differences);
      previousGrid = newGrid;
    }
    for (let redoId = 0; redoId !== undoDifferences.length; ++redoId) {
      // redo all previous undo
      await Controls.redo(driver);
      const newGrid = await Grid.read(driver);
      const differences = Grid.diff(newGrid, previousGrid);
      redoDifferences.push(differences);
      previousGrid = newGrid;
    }

    // Assert
    const newGrid = await Grid.read(driver);
    const differences = Grid.diff(initialGrid, newGrid);
    expect(differences).toEqual([]);
    expect(undoDifferences).toEqual(redoDifferences.reverse());

    // Update model
  }
  toString(): string {
    return `UndoAllRedoAll`;
  }
}
