module.exports = {

  inputs: {
    id: {
      type: 'string',
      require: true
    },
    title: {
      type: 'string',
      require: true
    },
    tz: {
      type: 'string',
      require: true
    },
    geo: {
      type: 'json',
    },
    maxPrice: {
      type: 'number',
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


  fn: async function ({id,title, tz, geo, maxPrice}, exits) {
    try {
      await City.updateOne({id}).set({title, tz, geo, maxPrice})
      let city = await City.findFull({id})
      exits.success(city)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
