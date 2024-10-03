const moment = require('moment')

module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    start: {
      type: 'string',
      required: true,
    },
    end: {
      type: 'string',
      required: true,
    }
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
      const days = [start]

      const startMomenent = moment(start, 'DD-MM-YY')

      while (true) {
        if (startMomenent.format('DD-MM-YY') !== end) {
          days.push(startMomenent.add(1, 'day').format('DD-MM-YY'))
        } else {
          break
        }
      }

      const [pointTz, cm] = await Promise.all([CoffeePoint.findTz(id), CoffeePoint.findOne({id}).select(["coffeeMachine"])])

      const stats = (await DayStatistic.find({
        point: id,
        statDay: days
      }).select(["records"])
        .sort("snapshotAt ASC"))
        .map(it => it.records)
        .reduce((acc, cur) => {
          acc.push(...cur)
          return acc
        }, [])
        .map(it=>{
          it.snapshotAtMsk = moment(it.snapshotAt).tz("Europe/Moscow").format("HH:mm:ss DD-MM-YY")
          it.snapshotAtLocal = moment(it.snapshotAt).tz(pointTz).format("HH:mm:ss DD-MM-YY")
          return it
        })

      let drinks = await CoffeeMachine.findDrinks({id:cm.coffeeMachine})

      exits.success({statistics: stats, drinks})
    } catch (err) {
      sails.log.error(err)
      exits.serverError(err)
    }
  },
}
