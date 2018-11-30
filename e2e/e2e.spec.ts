import * as fc from 'fast-check';
import { Builder, WebDriver } from 'selenium-webdriver';

import { NewGameCommand } from './commands/NewGameCommand';
import { PlayForbiddenTokenCommand } from './commands/PlayForbiddenTokenCommand';
import { PlayTokenCommand } from './commands/PlayTokenCommand';
import { Grid } from './components/Grid';
import { Model } from './Model';

const TimeoutMs = 10 * 60 * 1000; // 10min

describe('Playing with commands on UI', function() {
  let driver: WebDriver;

  beforeAll(async () => {
    const builder = new Builder().forBrowser('chrome');
    driver = await builder.build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it(
    'Various commands',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.commands(
            [
              fc.constant(new NewGameCommand()),
              fc.constant(new PlayForbiddenTokenCommand(0)),
              fc.constant(new PlayForbiddenTokenCommand(1)),
              fc.constant(new PlayForbiddenTokenCommand(2)),
              fc.constant(new PlayForbiddenTokenCommand(3)),
              fc.constant(new PlayForbiddenTokenCommand(4)),
              fc.constant(new PlayForbiddenTokenCommand(5)),
              fc.constant(new PlayForbiddenTokenCommand(6)),
              fc.constant(new PlayTokenCommand(0)),
              fc.constant(new PlayTokenCommand(1)),
              fc.constant(new PlayTokenCommand(2)),
              fc.constant(new PlayTokenCommand(3)),
              fc.constant(new PlayTokenCommand(4)),
              fc.constant(new PlayTokenCommand(5)),
              fc.constant(new PlayTokenCommand(6))
            ],
            100
          ),
          async cmds => {
            await driver.get('http://localhost:3000/');
            const model: Model = {
              playableColumn: await Grid.allPlayable(driver),
              grid: await Grid.emptyGrid(driver),
              currentPlayer: 0
            };
            const setup = () => ({ model, real: driver });
            await fc.asyncModelRun(setup, cmds);
          }
        )
      );
    },
    TimeoutMs
  );
});
