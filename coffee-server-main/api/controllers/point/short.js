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
      let points = await CoffeePoint.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner}).select(["city","title","isArchive"])
      return exits.success(points)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
