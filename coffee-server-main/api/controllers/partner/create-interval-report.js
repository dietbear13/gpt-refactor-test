module.exports = {

  inputs: {
    start: {
      type: 'number',
      required: true
    },
    end: {
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


  fn: async function ({start, end}, exits) {

    try {
      DocService.intervalReports({start, end})
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
