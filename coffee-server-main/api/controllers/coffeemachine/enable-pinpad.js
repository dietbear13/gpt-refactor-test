module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    isEnabled: {
      type: 'boolean',
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


  fn: async function ({id, isEnabled}, exits) {
    try {
      const result = await RedisService.pinpadMode({id, isEnabled})
      await CoffeeMachine.updateOne({id}).set({isPinpad:isEnabled})
      return exits.success({status: result.status})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
