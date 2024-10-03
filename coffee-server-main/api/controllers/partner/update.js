module.exports = {

  inputs: {
    id: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    inn: {
      type: 'string',
    },
    credentials: {
      type: 'json',
    },
    smartvendCredentials: {
      type: 'json',
    },
    cities: {
      type: 'json',
      defaultsTo: []
    },
    points: {
      type: 'json',
      defaultsTo: []
    },
    isEnabledCashback:{
      type: 'boolean',
      defaultsTo: false
    },
    isEnabledAbonement:{
      type: 'boolean',
      defaultsTo: false
    },
    isArchive:{
      type: 'boolean',
      defaultsTo: false
    },
    type:{
      type: 'string',
      defaultsTo: 'coffeemachine',
      isIn: ['coffeemachine', 'rent'],
    },
    skladId:{
      type: 'string'
    },
    atolCredentials:{
      type: 'json',
      defaultsTo: {
        kpp:"",
        company: "",
        hostname: "",
        groupCode: "",
        password: "",
        login: "",
      }
    },
    email:{
      type: 'string',
      require:true,
      isEmail: true
    },
    isEnabledDailyCost: {
      type: 'boolean',
      defaultsTo: false,
    },
    costPerUnit: {
      type: 'number',
      defaultsTo: 500
    },
    cloudKassa: {
      type: 'string',
      isIn:['atol','orangeData'],
      defaultsTo: 'atol'
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


  fn: async function ({id, title, phone, inn, credentials, smartvendCredentials, cities, points, isEnabledCashback, isEnabledAbonement, isArchive, type, skladId, atolCredentials, email, isEnabledDailyCost, costPerUnit, cloudKassa}, exits) {
    try {
      await Partner.updateOne({id}).set({title, phone, inn, credentials,smartvendCredentials, isEnabledCashback, isEnabledAbonement, isArchive, type, skladId, atolCredentials, email, isEnabledDailyCost, costPerUnit, cloudKassa})
      await Partner.replaceCollection(id, "cities").members(cities)
      await Partner.replaceCollection(id, "points").members(points)

      let less = await Partner.findFull({id})
      exits.success(less)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
