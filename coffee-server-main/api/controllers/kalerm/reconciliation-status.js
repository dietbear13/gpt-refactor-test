const moment = require('moment-timezone');

module.exports = {

  inputs: {
    isSuccess:{
      type: 'boolean',
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


  fn: async function ({isSuccess, snapshotAt}, exits) {
    try {
      const coffeeMachine = this.req.id
      const owner = this.req.owner
      await KaffitEvent.create({
        type: isSuccess ? 'warn' : 'error',
        coffeeMachine,
        owner,
        message: `Сверка терминала кофемашины ${isSuccess ? 'успешна': 'неуспешна'}, локальное время: ${moment(snapshotAt).tz(this.req.tz).format("HH:mm:ss DD.MM.YY")}`
      }).fetch()
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


