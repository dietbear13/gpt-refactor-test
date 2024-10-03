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
    period: {
      type: 'string',
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

  fn: async function ({id, start, end, period}, exits) {
    try {
      const stats = await DayStatistic.find({
        point: id,
        snapshotAt: {'>=': start, '<=': end}
      }).select(['statDay', 'profit', 'sale', 'saleCount']);
      const data = _.groupBy(stats, (it) => it.statDay);

      const result = {};

      for (let i = 0; i < Object.keys(data).length; i++) {
        const [key, value] = Object.entries(data)[i];
        result[key] = value.reduce((acc, cur) => {
          acc.profit += cur.profit;
          acc.sale += cur.sale;
          acc.saleCount += cur.saleCount;
          return acc;
        }, {
          statDay: key,
          profit: 0,
          sale: 0,
          saleCount: 0,
        });
      }

      let arr = Object.values(result);
      const statistic = {
        data: arr,
        ...arr.reduce((acc, cur) => {
          acc.profit += cur.profit;
          acc.sale += cur.sale;
          acc.saleCount += cur.saleCount;
          return acc;
        }, {
          profit: 0,
          sale: 0,
          saleCount: 0,
        })
      }

      statistic.data.sort((a,b)=> moment(a.statDay, 'DD-MM-YY').diff(moment(b.statDay, 'DD-MM-YY'),"hour"))
      exits.success(statistic);
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
