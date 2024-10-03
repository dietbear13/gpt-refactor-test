const moment = require('moment');

module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    sales: {
      type: 'json',
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
    forbidden: {
      responseType: 'forbidden',
    },
  },

  fn: async function ({id, sales}, exits) {
    try {
      const {partner} = await CoffeePoint.findOne({id}).select(["partner"])
      const tz = await Partner.findTz(partner);

      let statDays = []
      let ids = []
      sales.forEach(it => {
        statDays.push(moment(it.snapshotAt).tz(tz).format("DD-MM-YY"))
        ids.push(it.id)
      })

      statDays = [...new Set(statDays)]
      // console.log("remove dub", statDays)
      await DayStatistic.removeDuplicates({point:id, statDays, ids})
      exits.success()
    } catch (err) {
      sails.log.error(err)
      exits.serverError(err)
    }
  },
}
