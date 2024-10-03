
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
      // console.log("tz dic", City.tz)
      return exits.success(City.tz)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
