import { WebDriver, By } from 'selenium-webdriver';

export class Controls {
  static async newGame(driver: WebDriver) {
    await driver.findElement(By.id('new-game-button')).click();
  }
  static async canUndo(driver: WebDriver) {
    return await driver.findElement(By.id('undo-button')).isEnabled();
  }
  static async undo(driver: WebDriver) {
    await driver.findElement(By.id('undo-button')).click();
  }
  static async canRedo(driver: WebDriver) {
    return await driver.findElement(By.id('redo-button')).isEnabled();
  }
  static async redo(driver: WebDriver) {
    await driver.findElement(By.id('redo-button')).click();
  }
}
