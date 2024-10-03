module.exports = {

  inputs: {

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


  fn: async function (inputs, exits) {
    try {
      let cities = await City.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner})
        .populate("partners", {select:["title"]})
        .populate("points", {select:["title"]})

      cities = cities.map(it => {
        let {title, mskOffset} = City.tz.find(c => c.tzid === it.tz);
        it.tz = `${title} ${mskOffset}`
        return it
      })
      exits.success(cities)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
