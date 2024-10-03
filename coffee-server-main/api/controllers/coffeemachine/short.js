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
      let partners = (await CoffeeMachine.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner}).select(["sin", "point"]))
        .map(it=>{
          it.isFree = !!!it.point
          return _.omit(it,["point"])
        })
      return exits.success(partners)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
