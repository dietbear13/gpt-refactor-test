module.exports = {

  inputs: {
    id: {
      type: 'string',
      require: true
    },
    isEnabled: {
      type: 'boolean',
      require: true
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


  fn: async function ({id, isEnabled}, exits) {


    try {
      await RedisService.updateDrinks({id})
      await CoffeeMachine.enableMilk({id, isEnabled})
      exits.success({message: `Молочные напитки - ${isEnabled ? 'Включены' : 'Отключены'}`})
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
