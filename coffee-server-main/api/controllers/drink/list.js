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
      const list = []
      let drinks = await Drink.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner})

      for (let i = 0; i < drinks.length; i++) {
        const { image } = await DrinkFormula.findOne({drink:drinks[i].id}) || ''
        list.push({...drinks[i], image})
      }

      exits.success(list)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
