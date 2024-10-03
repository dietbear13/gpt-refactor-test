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
      let drinks = await Drink.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner}).select(["title", "price", "costPrice", "partner"])
      return exits.success(drinks)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
