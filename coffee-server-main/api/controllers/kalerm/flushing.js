module.exports = {

  inputs: {
    snapshotAt:{
      type: 'number',
      required: true
    }
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


  fn: async function ({snapshotAt}, exits) {
    try {
      const point = this.req.point
      if(!point) return exits.success()
      const coffeeMachine = this.req.id
      const tz = this.req.tz
      await CoffeePoint.flushingSystem({point, coffeeMachine, snapshotAt, tz})

      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


