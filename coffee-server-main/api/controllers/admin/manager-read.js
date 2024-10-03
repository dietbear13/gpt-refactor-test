
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

      let user = await Manager.findOne({id: userId});
      user.points =( await CoffeePoint.find({partner:user.partner}).select(['id'])).map(it => it.id);
      exits.success(user)

    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
