import { NLog } from 'tslog-fork';

const log = NLog.getInstance();
log.logger.settings.name = 'Вася';
log.logger.settings.prettyLogTemplate = '{{hh}}:{{MM}}:{{ss}} {{name}} {{logLevelName}} [{{fileNameWithLine}}] ';

log.debug({ asd: 11, erca: 'asdkjlh' });
