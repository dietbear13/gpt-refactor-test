const moment = require('moment');

module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
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
      const history = [];

      const purchases = await Purchase.find({point: id, status:'success'}).select(['title', 'amount', 'createdAt']);

      purchases.forEach((it) => {
        history.push({
          title: it.title,
          amount: '+' + it.amount + '₽',
          date: it.createdAt
        });
      });

      history.sort((a, b) => b.date - a.date);
      exits.success(history);
    } catch (err) {
      sails.log.error(err);
      exits.serverError(err);
    }
  }
};
