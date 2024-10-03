const moment = require('moment-timezone');

module.exports = {

  inputs: {
    status:{
      type: 'string',
      required: true
    },
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


  fn: async function ({status, snapshotAt}, exits) {
    try {
      const coffeeMachine = this.req.id
      const owner = this.req.owner
      await KaffitEvent.create({
        type: 'info',
        coffeeMachine,
        owner,
        message: `Статус кофемашины ${status}, локальное время: ${moment(snapshotAt).tz(this.req.tz).format("HH:mm:ss DD.MM.YY")}`
      }).fetch()
      await CoffeeMachine.updateOne({id:coffeeMachine}).set({status})
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


