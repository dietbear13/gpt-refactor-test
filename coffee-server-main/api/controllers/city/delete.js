module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
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
      await City.destroyOne({id}).fetch()
      return exits.success({id})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
