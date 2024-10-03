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
      const stats = await DayStatistic.find({
        point: points,
        snapshotAt: {'>=': start, '<=': end}
      }).select(['statDay', 'records', 'point']);
      const data = _.groupBy(stats, (it) => it.statDay);

      const result = {};

      for (let i = 0; i < Object.keys(data).length; i++) {
        const [key, value] = Object.entries(data)[i];
        result[key] = value.reduce((acc, cur) => {
          acc.records.push({
            point:{ id: cur.point, title: pts.find(p=>p.id === cur.point).title },
            records : cur.records
          });
          return acc;
        }, {
          statDay: key,
          records: [],
        });
      }

      let arr = Object.values(result);

      arr.sort((a, b) => moment(a.statDay, 'DD-MM-YY').diff(moment(b.statDay, 'DD-MM-YY'), "hour"))
      exits.success(arr);
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
