const { Logger, config, transports } = require('winston')

const customLogger = new Logger({
  formatter: function (options) {
    // - Return string will be passed to logger.
    // - Optionally, use options.colorize(options.level, <string>) to
    //   colorize output based on the log level.
    return (
      options.timestamp({ format: 'HH:MM:SS DD-MM-YY' }) +
      ' ' +
      config.colorize(options.level, options.level.toUpperCase()) +
      ' ' +
      (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length
        ? '\n\t' + JSON.stringify(options.meta)
        : '')
    )
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
    }),
    new transports.File({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
      timestamp: true,
      prettyPrint: true,
    }),
    new transports.File({
      name: 'coffeemachine-file',
      filename: 'filelog-coffeemachine.log',
      level: 'coffeemachine',
      timestamp: true,
      prettyPrint: true,
    }),
    new transports.File({
      name: 'statistic-file',
      filename: 'filelog-statistic.log',
      level: 'statistic',
      timestamp: true,
      prettyPrint: true,
    }),
    new transports.File({
      name: 'cooking-file',
      filename: 'filelog-cooking.log',
      level: 'cooking',
      timestamp: true,
      prettyPrint: true,
    }),
  ],
})
module.exports.log = {
  /***************************************************************************
   *                                                                          *
   * Valid `level` configs: i.e. the minimum log level to capture with        *
   * sails.log.*()                                                            *
   *                                                                          *
   * The order of precedence for log levels from lowest to highest is:        *
   * silly, verbose, info, debug, warn, error                                 *
   *                                                                          *
   * You may also set the level to "silent" to suppress all logs.             *
   *                                                                          *
   ***************************************************************************/

  custom: customLogger,
  inspect: false,
  // level: 'warn'
}

// module.exports = customLogger
