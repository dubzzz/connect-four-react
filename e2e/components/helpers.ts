import { WebElement } from 'selenium-webdriver';

export const hasClass = async function(el: WebElement, className: string) {
  const classesRaw = await el.getAttribute('class');
  return classesRaw.split(' ').indexOf(className) !== -1;
};
