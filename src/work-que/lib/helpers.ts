import { SimpleLog } from 'tslog-fork';

export function namedLog(logName: string) {
  const log = new SimpleLog();
  log.logger.settings.name = logName;
  log.logger.settings.prettyLogTemplate = '{{hh}}:{{MM}}:{{ss}} {{name}} {{logLevelName}} [{{fileNameWithLine}}] ';

  return log;
}
