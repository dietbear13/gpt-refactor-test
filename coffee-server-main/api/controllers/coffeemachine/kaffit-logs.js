module.exports = {

  inputs: {
    id: {
      type: 'string',
      required:true
    },
    count: {
      type: 'number',
      defaultsTo:200
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


  fn: async function ({id, count}, exits) {

    try {
      let machines = await KaffitEvent.find({coffeeMachine: id}).sort("createdAt DESC").limit(count)

      return exits.success(machines);
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
