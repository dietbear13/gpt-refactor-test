module.exports = {

  inputs: {
    id: {
      type: 'string',
      required:true
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
      await KaffitEvent.update({coffeeMachine: id}).set({isRead:true})
      await CacheService.resetLog(id)
      return exits.success();
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
