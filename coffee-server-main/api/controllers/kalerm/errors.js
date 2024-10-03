const moment = require('moment-timezone');

module.exports = {

  inputs: {
    errors:{
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


  fn: async function ({errors, snapshotAt}, exits) {
    try {
      const coffeeMachine = this.req.id
      const owner = this.req.owner
      await KaffitEvent.create({
        type: 'error',
        coffeeMachine,
        owner,
        message: `Ошибки кофемашины ${errors}, локальное время: ${moment(snapshotAt).tz(this.req.tz).format("HH:mm:ss DD.MM.YY")}`
      }).fetch()
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


