module.exports = {

  inputs: {
    drink: {
      type: 'string',
      required: true
    },
    coffeeMachine: {
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


  fn: async function ({drink, coffeeMachine, formula}, exits) {
    try {
      const df = await DrinkFormula.findOne({drink, coffeeMachine})

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
          isMoreEspresso:formula.isMoreEspresso,
          precook:formula.precook,
          repeatCoffee:formula.repeatCoffee,
          repeatHotwater:formula.repeatHotwater,
          basicVolume:formula.basicVolume,
          volume:formula.volume,
          sdk:formula.sdk,
          image:formula.image,
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
          isMoreEspresso:formula.isMoreEspresso,
          precook:formula.precook,
          repeatCoffee:formula.repeatCoffee,
          repeatHotwater:formula.repeatHotwater,
          sdk:formula.sdk,
          image:formula.image,
          drink,
          coffeeMachine
        }).fetch()
      }
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};


