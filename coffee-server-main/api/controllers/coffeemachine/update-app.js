module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
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


  fn: async function ({id}, exits) {
    try {
      const result = await RedisService.updateApp({id, url:"https://crm.dobryicoffee.ru/uploads/points/DC_HMI_null_Gamma_Stable_06_56_05_30_Release.apk"})
      return exits.success({status: result.status})
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
