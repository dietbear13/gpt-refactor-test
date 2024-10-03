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
      let pts = await CoffeePoint.find({partner: id}).select(['id', 'title'])
      let points = pts.map(it => it.id);
      let stats = await DayStatistic.find({
        point: points,
        snapshotAt: {'>=': start, '<=': end}
      }).select(['statDay', 'records', 'point', 'profit', 'sale', 'saleCount']);

      stats = stats.map(it => {
        it.title = pts.find(p=>p.id === it.point)?.title ?? ""
        return it
      })

      const dataByPoints = _.groupBy(stats, (it) => it.point);



      /*const resultPoint = {};

      for (let i = 0; i < Object.keys(dataByPoints).length; i++) {
        const [key, value] = Object.entries(dataByPoints)[i];
        resultPoint[key] = value.reduce((acc, cur) => {
          acc.free += cur.free;
          acc.freeCount += cur.freeCount;
          acc.profit += cur.profit;
          acc.sale += cur.sale;
          acc.saleCount += cur.saleCount;
          return acc;
        }, {
          point: key,
          title: pts.find(it => it.id === key).title,
          free: 0,
          freeCount: 0,
          profit: 0,
          sale: 0,
          saleCount: 0,
        });
      }

      let arr2 = Object.values(resultPoint);*/
      exits.success(Object.values(dataByPoints));
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
