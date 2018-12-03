import * as fc from 'fast-check';
import { Builder, WebDriver } from 'selenium-webdriver';

import { NewGameCommand } from './commands/NewGameCommand';
import { PlayForbiddenTokenCommand } from './commands/PlayForbiddenTokenCommand';
import { PlayTokenCommand } from './commands/PlayTokenCommand';
import { Grid } from './components/Grid';
import { Model } from './Model';
import { CheckPlayerTurnCommand } from './commands/CheckPlayerTurnCommand';
import { CheckEndOfGameCommand } from './commands/CheckEndOfGameCommand';
import { UndoCommand } from './commands/UndoCommand';
import { RedoCommand } from './commands/RedoCommand';

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
              fc.constant(new UndoCommand()),
              fc.constant(new RedoCommand()),
              fc.constant(new CheckEndOfGameCommand()),
              fc.constant(new CheckPlayerTurnCommand()),
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
            250
          ),
          async cmds => {
            await driver.get('http://localhost:3000/');
            const emptyGrid = await Grid.emptyGrid(driver);
            const model: Model = {
              playableColumn: await Grid.allPlayable(driver),
              currentPlayer: 0,
              history: { cursor: 0, grids: [emptyGrid] }
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
