const moment = require('moment');

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
      let statuses = (await CoffeePoint.find({partner:id}).select(['id']).populate("coffeeMachine"))
        .filter(it =>it.coffeeMachine)
        .map(it => it.coffeeMachine.status);
      exits.success(statuses);
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  },
};
