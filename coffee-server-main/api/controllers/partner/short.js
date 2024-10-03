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
      let partners = await Partner.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner}).select(["title", "isArchive"])
      return exits.success(partners)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
