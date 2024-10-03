module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
   /* basicVolume: {
      type: 'number',
      required: true
    },
    volume: {
      type: 'number',
      required: true
    },*/
    coffeeAmount: {
      type: 'number',
      required: true
    },
    coffeeMilkTogether: {
      type: 'boolean',
      required: true
    },
    coffeeTemperature: {
      type: 'number',
      required: true
    },
    concentration: {
      type: 'number',
      required: true
    },
    drinkType: {
      type: 'number',
      isIn: [1, 2, 3, 4, 5, 6, 7, 8], //1-espresso 2-americano 3-hot_water 4-capuchino 5-macchiato 6-latte 7-hot_milk 8-cream
      required: true
    },
    hotwaterAmount: {
      type: 'number',
      required: true
    },
    hotwaterTemperature: {
      type: 'number',
      required: true
    },
    isMoreEspresso: {
      type: 'boolean',
      required: true
    },
    milkFoamTime: {
      type: 'number',
      required: true
    },
    milkTime: {
      type: 'number',
      required: true
    },
    precook: {
      type: 'boolean',
      defaultsTo: false
    },
    repeatCoffee: {
      type: 'number',
      required: true
    },
    repeatHotwater: {
      type: 'number',
      required: true
    },
    sdk: {
      type: 'string',
      required: true
    },
    image: {
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


  fn: async function ({
                        id,
                       /* basicVolume,
                        volume,*/
                        coffeeAmount,
                        coffeeMilkTogether,
                        coffeeTemperature,
                        concentration,
                        drinkType,
                        hotwaterAmount,
                        hotwaterTemperature,
                        isMoreEspresso,
                        milkFoamTime,
                        milkTime,
                        precook,
                        repeatCoffee,
                        repeatHotwater,
                        sdk,
                        image
                      }, exits) {
    try {
      let formula = await DrinkFormula.updateOne({ id}).set({
        coffeeAmount,
        coffeeMilkTogether,
        coffeeTemperature,
        concentration,
        drinkType,
        hotwaterAmount,
        hotwaterTemperature,
        isMoreEspresso,
        milkFoamTime,
        milkTime,
        precook,
        repeatCoffee,
        repeatHotwater,
        sdk,
        image
      })

      exits.success(formula)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};

