const moment = require('moment');

const getMomentIntervals = (start, end) => {
  const s = start.clone().startOf("day")
  const e = end.clone().startOf("day")
  const arr = [s.format("DD-MM-YY")]

  while (s.isBefore(e)) {
    s.add(1,"day")
    arr.push(s.format("DD-MM-YY"))
  }
  return arr
}

const sumSales = (arr)=>{
  return arr.reduce((acc, cur)=>{
    acc.profit += cur.profit;
    acc.sale += cur.sale;
    acc.saleCount += cur.saleCount;
    return acc
  },{
    profit: 0,
    sale: 0,
    saleCount: 0
  })
}

module.exports = {
  inputs: {
    id: {
      type: 'string',
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

  fn: async function ({id}, exits) {
    try {
      const tz = await CoffeePoint.findTz(id);
      const today = moment().tz(tz);
      const startToday = today.clone().startOf('day');
      const startPrevDay = startToday.clone().add(-1, 'day');

      const startWeek = today.clone().startOf('week').add(1,'day');
      const startPrevWeek = startWeek.clone().add(-1,'week');

      const startMonth = startToday.clone().startOf( 'month');
      const startPrevMonth = startMonth.clone().add( -1,'month');

      const end= today.clone().endOf('day')
      const start= today.clone().startOf('month').add(-1, 'month')

      const allIntervals = getMomentIntervals(start,end)

      const stats = await DayStatistic.find({
        point: id,
        statDay: allIntervals
      }).select(['statDay', 'profit', 'sale', 'saleCount', 'snapshotAt']);

      const todayStat = stats.filter(it => it.snapshotAt >= startToday.valueOf())
      const prevDayStat = stats.filter(it => it.snapshotAt < startToday.valueOf() && it.snapshotAt >= startPrevDay.valueOf())

      const weekStat = stats.filter(it => it.snapshotAt >= startWeek.valueOf())
      const prevWeekStat = stats.filter(it => it.snapshotAt < startWeek.valueOf() &&  it.snapshotAt >= startPrevWeek.valueOf())

      const monthStat = stats.filter(it => it.snapshotAt >= startMonth.valueOf())
      const prevMonthStat = stats.filter(it =>  it.snapshotAt >= startPrevMonth.valueOf() && it.snapshotAt < startMonth.valueOf())

      exits.success({
        todayStat : sumSales(todayStat),
        prevDayStat : sumSales(prevDayStat),
        weekStat : sumSales(weekStat),
        prevWeekStat : sumSales(prevWeekStat),
        monthStat : sumSales(monthStat),
        prevMonthStat : sumSales(prevMonthStat),
      });

    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
