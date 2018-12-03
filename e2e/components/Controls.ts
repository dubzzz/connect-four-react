import { WebDriver, By } from 'selenium-webdriver';

export class Controls {
  static async newGame(driver: WebDriver) {
    await driver.findElement(By.id('new-game-button')).click();
  }
  static async undo(driver: WebDriver) {
    await driver.findElement(By.id('undo-button')).click();
  }
  static async redo(driver: WebDriver) {
    await driver.findElement(By.id('redo-button')).click();
  }
}
