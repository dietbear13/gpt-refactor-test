module.exports = {

  inputs: {
    id: {
      type: 'string',
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


  fn: async function ({id}, exits) {
    try {
      const {coffeeMachine} = await CoffeePoint.findOne({id}).select(["coffeeMachine"])
      if(coffeeMachine){
        await CoffeeMachine.updateOne({id: coffeeMachine}).set({point: null})
      }
      await CoffeePoint.destroyOne({id}).fetch()
      return exits.success({id})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
