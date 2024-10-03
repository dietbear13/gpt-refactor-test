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
      let partners = this.req.isSuperAdmin ? await City.find().select(["title"]) : (await Partner.findOne({id:this.req.partner}).populate("cities", {select:"title"})).cities
      return exits.success(partners)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
