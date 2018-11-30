import { WebDriver, By } from 'selenium-webdriver';

export class Controls {
  static async newGame(driver: WebDriver) {
    await driver.findElement(By.id('new-game-button')).click();
  }
}
