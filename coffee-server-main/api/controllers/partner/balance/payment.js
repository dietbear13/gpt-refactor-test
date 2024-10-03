module.exports = {
  inputs: {
    amount: {
      type: 'number',
      required: true,
    },
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
      responseType: 'badRequest'
    },
    forbidden: {
      responseType: 'forbidden'
    },
    serverError: {
      responseType: 'serverError'
    }
  },


  fn: async function ({amount, id}, exits) {

    try {
      if(amount<=100) return exits.badRequest({message:"Сумма пополнения должна быть больше 100 руб"})
      const url = await PaymentService.createPartnerOrder({amount, partner:id});
      return exits.success({url})
    } catch (e) {
      sails.log.error(e)
      exits.serverError(e)
    }

  },


};
