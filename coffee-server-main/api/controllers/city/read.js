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
      let less = await City.findFull({id})
      exits.success(less)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
