import { WebDriver, By } from 'selenium-webdriver';

export class Instructions {
  static async read(driver: WebDriver) {
    return (await driver.findElement(By.className('instructions')).getText()).trim();
  }
}
