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
      const {point} = await CoffeeMachine.findOne({id}).select(["point"])
      if(point){
        await CoffeePoint.updateOne({id:point}).set({coffeeMachine: null})
      }
      await CoffeeMachine.destroyOne({id}).fetch()
      return exits.success({id})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
