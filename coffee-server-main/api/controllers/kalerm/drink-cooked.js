module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    drink: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    profit: {
      type: 'number',
    },
    isTest: {
      type: 'boolean',
      defaultsTo:false
    },
    snapshotAt:{
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
  },


  fn: async function ({ id, drink, title, amount, profit, isTest, snapshotAt}, exits) {
    try {
      const point = this.req.point
      const owner = this.req.owner
      const coffeeMachine = this.req.id
      const dr = await Drink.findOne({id:drink}).select(['title'])
      await DayStatistic.pushRecord({point, record:{id, drink, title:dr.title, display:title, amount, profit, isTest, snapshotAt}, owner})
      try {
        sails.log.warn("drink cooked", point, drink)
        await CoffeePoint.calculateConsumption({id: point, drink});
        await CoffeeMachine.incrementCounters({id: coffeeMachine, records: [{id, drink, title:dr.title, display:title, amount, profit, isTest, snapshotAt}]});
      }catch (e) {
        sails.log.error("error calculate Consumption", e)
      }
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


