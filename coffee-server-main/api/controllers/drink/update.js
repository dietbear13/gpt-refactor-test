module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    costPrice: {
      type: 'number',
      required: true
    },
    volume: {
      type: 'number',
      required: true
    },
    water: {
      type: 'number',
      required: true
    },
    milk: {
      type: 'number',
      required: true
    },
    coffee: {
      type: 'number',
      required: true
    },
    cookingDuration: {
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


  fn: async function ({
                        id,
                        title,
                        price,
                        costPrice,
                        volume,
                        water,
                        milk,
                        coffee,
                        cookingDuration
                      }, exits) {
    try {
      let cp = await Drink.updateOne({id}).set({
        title,
        price,
        costPrice,
        volume,
        water,
        milk,
        coffee,
        cookingDuration
      })

      exits.success(cp)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
