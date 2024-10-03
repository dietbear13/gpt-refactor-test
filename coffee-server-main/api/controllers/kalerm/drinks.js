module.exports = {

  inputs: {

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


  fn: async function ({}, exits) {
    try {
      const id = this.req.id
      const profile = await CoffeeMachine.findKalermDrinks({id})
      exits.success(profile)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


