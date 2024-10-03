module.exports = {
  inputs: {

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


  fn: async function (inputs, exits) {
    try {
      const group = await DrinkGroup.find({coffeeMachine:this.req.id})
      return exits.success(group);
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
