
module.exports = {

  inputs: {},


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
    },
  },


  fn: async function (inputs, exits) {
    try {
      let userId = this.req['userId'];

      let user = await Manager.findOne({id: userId})
      if (user) {
        await this.req.session.destroy()
        return exits.success()
      } else {
        return exits.forbidden()
      }

    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
