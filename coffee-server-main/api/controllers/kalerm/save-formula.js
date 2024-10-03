module.exports = {

  inputs: {
    id: {
      type: 'string',
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
    formula: {
      type: 'json',
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


  fn: async function ({id, sdk, image, formula}, exits) {
    try {
      const coffeeMachine = this.req.id
      const df = await DrinkFormula.findOne({drink: id, coffeeMachine})

      if (df) {
        await DrinkFormula.updateOne({id:df.id}).set({
          coffeeAmount:formula.coffeeAmount,
          coffeeMilkTogether:formula.coffeeMilkTogether,
          coffeeTemperature:formula.coffeeTemperature,
          concentration:formula.concentration,
          drinkType:formula.drinkType,
          hotwaterAmount:formula.hotwaterAmount,
          hotwaterTemperature:formula.hotwaterTemperature,
          keyIndex:formula.keyIndex,
          milkFoamTime:formula.milkFoamTime,
          milkTime:formula.milkTime,
          isMoreEspresso:formula.moreEspresso,
          precook:formula.precook,
          repeatCoffee:formula.repeatCoffee,
          repeatHotwater:formula.repeatHotwater,
          basicVolume:formula.basicVolume,
          volume:formula.volume,
        })
      } else {
        await DrinkFormula.create({
          coffeeAmount:formula.coffeeAmount,
          coffeeMilkTogether:formula.coffeeMilkTogether,
          coffeeTemperature:formula.coffeeTemperature,
          concentration:formula.concentration,
          drinkType:formula.drinkType,
          hotwaterAmount:formula.hotwaterAmount,
          hotwaterTemperature:formula.hotwaterTemperature,
          keyIndex:formula.keyIndex,
          milkFoamTime:formula.milkFoamTime,
          milkTime:formula.milkTime,
          isMoreEspresso:formula.moreEspresso,
          precook:formula.precook,
          repeatCoffee:formula.repeatCoffee,
          repeatHotwater:formula.repeatHotwater,
          sdk,
          image,
          drink:id,
          coffeeMachine
        }).fetch()
      }
      exits.success()
    } catch (err) {
      sails.log.error(err)
      exits.success()

      // throw {serverError: {message: err.message}}
    }
  }
};


