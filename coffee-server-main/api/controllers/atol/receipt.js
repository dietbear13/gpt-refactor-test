module.exports = {

  inputs: {
    id:{
      type: 'string',
      required: true
    },
    uuid:{
      type: 'string',
    },
    payload:{
      type: 'json',
    },
    error:{
      type: 'string',
      allowNull: true
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


  fn: async function ({id, uuid, payload, error}, exits) {
    try {
      const pur = await Purchase.updateOne({id}).set({status: error ? 'error' : 'success', error, payload, ofdUrl:payload.ofd_receipt_url })

      try{
        RedisService.newReceipt({sin:pur.sin, url:pur.ofdUrl, id})
      }catch (e) {
        sails.log.error("REDIS newReceipt",e.message)
      }
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


