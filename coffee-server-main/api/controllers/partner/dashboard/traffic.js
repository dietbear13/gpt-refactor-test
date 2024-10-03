const moment = require('moment');

module.exports = {
  inputs: {
    id: {
      type: 'string',
      require: true,
    },
    start: {
      type: 'number',
      require: true,
    },
    end: {
      type: 'number',
      require: true,
    },
  },

  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest',
    },
    serverError: {
      responseType: 'serverError',
    },
  },

  fn: async function ({id, start, end}, exits) {
    try {
      let points = (await CoffeePoint.find({partner: id}).select(['id'])).map(it => it.id);
      let stats = (await DayStatistic.find({
        point: points,
        snapshotAt: {'>=': start, '<=': end}
      }).select(['records']))
        .map(it => it.records)
        .reduce((acc, cur) => [...acc, ...cur], []);

      exits.success(stats);
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
