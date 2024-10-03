module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    currentWater: {
      type: 'number',
      required: true
    },
    currentMilk: {
      type: 'number',
      required: true
    },
    currentCoffee: {
      type: 'number',
      required: true
    },
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


  fn: async function ({id, currentWater, currentMilk, currentCoffee}, exits) {
    try {
      await CoffeePoint.updateOne({id}).set({currentWater, currentMilk, currentCoffee})
      let point = await CoffeePoint.findFull({id})
      return exits.success(point)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
