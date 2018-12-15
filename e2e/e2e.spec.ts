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
import { ReopenViaUrlCommand } from './commands/ReopenViaUrlCommand';
import { RefreshCommand } from './commands/RefreshCommand';

const TimeoutMin = 30;
const TimeoutMs = TimeoutMin * 60 * 1000;

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
              fc.constant(new RefreshCommand()),
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
              fc.constant(new PlayTokenCommand(6)),
              fc.nat().map(idx => new ReopenViaUrlCommand(idx))
            ],
            250
          ),
          async cmds => {
            await driver.get('about:blank');
            await driver.get('http://localhost:3000/');
            const dims = await Grid.readDimensions(driver);
            const emptyGrid = Grid.emptyGrid(dims.rows, dims.cols);
            const model: Model = {
              currentPlayer: 0,
              history: {
                cursor: 0,
                state: [{ grid: emptyGrid, playable: Array(dims.cols).fill(true), currentPlayer: 0 }]
              },
              previouslySeenPaths: {}
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
