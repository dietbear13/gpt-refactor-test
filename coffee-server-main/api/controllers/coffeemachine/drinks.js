module.exports = {

  inputs: {
    id: {
      type: 'string',
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


  fn: async function ({id}, exits) {
    try {
      let drinks = await CoffeeMachine.findDrinks({id})

      return exits.success(drinks);
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
