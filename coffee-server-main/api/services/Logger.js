const { Logger, transports } = require('winston');

const customLoggerError = new Logger({
  levels: {
    error: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerWarn = new Logger({
  levels: {
    warn: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'warn-file',
      filename: 'filelog-warn.log',
      level: 'warn',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerPromo = new Logger({
  levels: {
    promo: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'promo-file',
      filename: 'filelog-promo.log',
      level: 'promo',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerPurchase = new Logger({
  levels: {
    info: 1,
    error: 2,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'promo-info-file',
      filename: 'filelog-promo-info.log',
      level: 'info',
      timestamp: true,
      prettyPrint: true,
    }),
    new transports.File({
      name: 'promo-error-file',
      filename: 'filelog-promo-error.log',
      level: 'error',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerCM = new Logger({
  levels: {
    coffeemachine: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'coffeemachine-file',
      filename: 'filelog-coffeemachine.log',
      level: 'coffeemachine',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerStat = new Logger({
  levels: {
    statistic: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'statistic-file',
      filename: 'filelog-statistic.log',
      level: 'statistic',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerCook = new Logger({
  levels: {
    cooking: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'cooking-file',
      filename: 'filelog-cooking.log',
      level: 'cooking',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const customLoggerSave = new Logger({
  levels: {
    save: 1,
  },

  transports: [
    new transports.Console({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
    }),
    new transports.File({
      name: 'save-file',
      filename: 'filelog-save.log',
      level: 'save',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

module.exports = {
  error: customLoggerError.error,
  warn: customLoggerWarn.warn,
  coffeemachine: customLoggerCM.coffeemachine,
  statistic: customLoggerStat.statistic,
  cooking: customLoggerCook.cooking,
  save: customLoggerSave.save,
  promo: customLoggerPromo.promo,
  purchaseInfo: customLoggerPromo.info,
  purchaseError: customLoggerPromo.error,
};
