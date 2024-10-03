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
      const result = await RedisService.version({id})
      return exits.success({status: result.status})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
