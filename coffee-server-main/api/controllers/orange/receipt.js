module.exports = {

  inputs: {
    purchaseId:{
      type: 'string',
      required: true
    },
    id:{
      type: 'string',
    },
    ofdWebsite:{
      type: 'string',
    },
    errors:{
      type: 'json'
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


  fn: async function ({purchaseId, id, ofdWebsite, errors}, exits) {
    try {
      const pur = await Purchase.updateOne({id:purchaseId}).set({status: errors && errors.length > 0 ? 'error' : 'success', error: errors?.join(" , "),  ofdUrl:ofdWebsite})

      try{
        RedisService.newReceipt({sin:pur.sin, url:pur.ofdUrl, id:purchaseId, payload:errors})
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


