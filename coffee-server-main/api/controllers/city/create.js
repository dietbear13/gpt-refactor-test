module.exports = {

  inputs: {
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
    forbidden: {
      responseType: 'forbidden'
    },
  },


  fn: async function ({title, tz, geo, maxPrice}, exits) {

    try {
      let {id} = await City.create({title, tz, geo, maxPrice}).fetch()
      let city = await City.findFull({id})
      exits.success(city)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
