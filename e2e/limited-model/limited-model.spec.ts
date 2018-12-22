import * as fc from 'fast-check';
import { Builder, WebDriver } from 'selenium-webdriver';
import { LimitedModel } from './LimitedModel';
import { NewGameCommand } from './commands/NewGameCommand';
import { RefreshCommand } from './commands/RefreshCommand';
import { UndoCommand } from './commands/UndoCommand';
import { RedoCommand } from './commands/RedoCommand';
import { ReopenViaUrlCommand } from './commands/ReopenViaUrlCommand';
import { SaveUrlCommand } from './commands/SaveUrlCommand';
import { PlayTokenCommand } from './commands/PlayTokenCommand';
import { PlayForbiddenTokenCommand } from './commands/PlayForbiddenTokenCommand';
import { CheckPlayerTurnCommand } from './commands/CheckPlayerTurnCommand';
import { CheckEndOfGameCommand } from './commands/CheckEndOfGameCommand';
import { UndoAllRedoAllCommand } from './commands/UndoAllRedoAllCommand';

const TimeoutMin = 30;
const TimeoutMs = TimeoutMin * 60 * 1000;

describe('Limited Model', function() {
  let driver: WebDriver;

  beforeAll(async () => {
    const builder = new Builder().forBrowser('chrome');
    driver = await builder.build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it(
    'Playing with commands on UI',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.commands(
            [
              fc.constant(new CheckEndOfGameCommand()),
              fc.constant(new CheckPlayerTurnCommand()),
              fc.constant(new NewGameCommand()),
              fc.constant(new RedoCommand()),
              fc.constant(new RefreshCommand()),
              fc.nat().map(id => new ReopenViaUrlCommand(id)),
              fc.constant(new SaveUrlCommand()),
              fc.constant(new UndoCommand()),
              fc.constant(new UndoAllRedoAllCommand()),
              fc.constant(new PlayTokenCommand(0)),
              fc.constant(new PlayTokenCommand(1)),
              fc.constant(new PlayTokenCommand(2)),
              fc.constant(new PlayTokenCommand(3)),
              fc.constant(new PlayTokenCommand(4)),
              fc.constant(new PlayTokenCommand(5)),
              fc.constant(new PlayTokenCommand(6)),
              fc.constant(new PlayForbiddenTokenCommand(0)),
              fc.constant(new PlayForbiddenTokenCommand(1)),
              fc.constant(new PlayForbiddenTokenCommand(2)),
              fc.constant(new PlayForbiddenTokenCommand(3)),
              fc.constant(new PlayForbiddenTokenCommand(4)),
              fc.constant(new PlayForbiddenTokenCommand(5)),
              fc.constant(new PlayForbiddenTokenCommand(6))
            ],
            250
          ),
          async cmds => {
            await driver.get('about:blank');
            await driver.get('http://localhost:3000/');
            const model: LimitedModel = {
              currentPlayer: 0,
              driver,
              history: {}
            };
            const setup = () => ({ model, real: driver });
            await fc.asyncModelRun(setup, cmds);
          }
        ),
        { verbose: 2 }
      );
    },
    TimeoutMs
  );
});
