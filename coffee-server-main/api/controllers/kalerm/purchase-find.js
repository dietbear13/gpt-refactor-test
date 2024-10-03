const moment = require('moment-timezone');
const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

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
      const coffeeMachine = this.req.id
      const partner = this.req.partner

      let retry = 0

      while (retry < 8) {
        const purchase = await Purchase.findOne({
          externalId: `${id}:${partner}:${coffeeMachine}`,
        }).select(['ofdUrl'])
        if (purchase && purchase.ofdUrl) {
          return exits.success({url: purchase.ofdUrl})
        }
        retry = retry + 1;
        await delay(5000)
        sails.log.warn("purchase url not found", retry, purchase.ofdUrl, purchase.externalId)
      }

      exits.success({url: null})
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


