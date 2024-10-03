const { updateDrinks } = require('../../services/RedisService')
module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    sin: {
      type: 'string',
      required: true
    },
    partner: {
      type: 'string',
      required: true
    },
    point: {
      type: 'string',
      allowNull: true
    },
    drink1: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink1: {
      type: 'boolean',
      defaultsTo: true
    },
    drink2: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink2: {
      type: 'boolean',
      defaultsTo: true
    },
    drink3: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink3: {
      type: 'boolean',
      defaultsTo: true
    },
    drink4: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink4: {
      type: 'boolean',
      defaultsTo: true
    },
    drink5: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink5: {
      type: 'boolean',
      defaultsTo: true
    },
    drink6: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink6: {
      type: 'boolean',
      defaultsTo: true
    },
    drink7: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink7: {
      type: 'boolean',
      defaultsTo: true
    },
    drink8: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink8: {
      type: 'boolean',
      defaultsTo: true
    },
    drink9: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink9: {
      type: 'boolean',
      defaultsTo: true
    },
    drink10: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink10: {
      type: 'boolean',
      defaultsTo: true
    },
    drink11: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink11: {
      type: 'boolean',
      defaultsTo: true
    },
    drink12: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink12: {
      type: 'boolean',
      defaultsTo: true
    },
    drink13: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink13: {
      type: 'boolean',
      defaultsTo: true
    },
    drink14: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink14: {
      type: 'boolean',
      defaultsTo: true
    },
    drink15: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink15: {
      type: 'boolean',
      defaultsTo: true
    },
    drink16: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink16: {
      type: 'boolean',
      defaultsTo: true
    },
    drink17: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink17: {
      type: 'boolean',
      defaultsTo: true
    },
    drink18: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink18: {
      type: 'boolean',
      defaultsTo: true
    },
    drink19: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink19: {
      type: 'boolean',
      defaultsTo: true
    },
    drink20: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink20: {
      type: 'boolean',
      defaultsTo: true
    },
    drink21: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink21: {
      type: 'boolean',
      defaultsTo: true
    },
    drink22: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink22: {
      type: 'boolean',
      defaultsTo: true
    },
    drink23: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink23: {
      type: 'boolean',
      defaultsTo: true
    },
    drink24: {
      type: 'string',
      allowNull: true
    },
    isEnabledDrink24: {
      type: 'boolean',
      defaultsTo: true
    },
    flushingVolume: {
      type: 'number',
      defaultsTo: 0
    },
    flushingMilkVolume: {
      type: 'number',
      defaultsTo: 0
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
                        sin,
                        partner,
                        point,
                        drink1,
                        drink2,
                        drink3,
                        drink4,
                        drink5,
                        drink6,
                        drink7,
                        drink8,
                        drink9,
                        drink10,
                        drink11,
                        drink12,
                        drink13,
                        drink14,
                        drink15,
                        drink16,
                        drink17,
                        drink18,
                        drink19,
                        drink20,
                        drink21,
                        drink22,
                        drink23,
                        drink24,
                        isEnabledDrink1,
                        isEnabledDrink2,
                        isEnabledDrink3,
                        isEnabledDrink4,
                        isEnabledDrink5,
                        isEnabledDrink6,
                        isEnabledDrink7,
                        isEnabledDrink8,
                        isEnabledDrink9,
                        isEnabledDrink10,
                        isEnabledDrink11,
                        isEnabledDrink12,
                        isEnabledDrink13,
                        isEnabledDrink14,
                        isEnabledDrink15,
                        isEnabledDrink16,
                        isEnabledDrink17,
                        isEnabledDrink18,
                        isEnabledDrink19,
                        isEnabledDrink20,
                        isEnabledDrink21,
                        isEnabledDrink22,
                        isEnabledDrink23,
                        isEnabledDrink24,
                        flushingVolume,
                        flushingMilkVolume
                      }, exits) {
    try {

      const uniqueDrinks = [drink1, drink2, drink3, drink4, drink5, drink6, drink7, drink8, drink9, drink10, drink11, drink12, drink13, drink14, drink15, drink16, drink17, drink18, drink19, drink20, drink21, drink22, drink23, drink24]
        .filter(it => it !== null)

      if ((new Set(uniqueDrinks)).size !== uniqueDrinks.length) {
        return exits.serverError({message: 'Каждый напиток в кофмешине должен быть уникален'})
      }


      let {owner} = await Partner.findOne({id: partner}).select(["owner"])
      const cMachine = await CoffeeMachine.findOne({id})
      const cPoint = cMachine.point

      if (cPoint && point !== cPoint) {
        await CoffeePoint.updateOne({id: cPoint}).set({coffeeMachine: null})
        await CoffeePoint.updateOne({id: point}).set({coffeeMachine: id})
      }

      const cm = await CoffeeMachine.updateOne({id}).set({
        sin: sin?.trim(),
        point,
        partner,
        owner,
        drink1,
        drink2,
        drink3,
        drink4,
        drink5,
        drink6,
        drink7,
        drink8,
        drink9,
        drink10,
        drink11,
        drink12,
        drink13,
        drink14,
        drink15,
        drink16,
        drink17,
        drink18,
        drink19,
        drink20,
        drink21,
        drink22,
        drink23,
        drink24,
        isEnabledDrink1,
        isEnabledDrink2,
        isEnabledDrink3,
        isEnabledDrink4,
        isEnabledDrink5,
        isEnabledDrink6,
        isEnabledDrink7,
        isEnabledDrink8,
        isEnabledDrink9,
        isEnabledDrink10,
        isEnabledDrink11,
        isEnabledDrink12,
        isEnabledDrink13,
        isEnabledDrink14,
        isEnabledDrink15,
        isEnabledDrink16,
        isEnabledDrink17,
        isEnabledDrink18,
        isEnabledDrink19,
        isEnabledDrink20,
        isEnabledDrink21,
        isEnabledDrink22,
        isEnabledDrink23,
        isEnabledDrink24,
        flushingVolume,
        flushingMilkVolume
      })

      try {
        if (cMachine.drink1 !== drink1 || cMachine.drink2 !== drink2 || cMachine.drink3 !== drink3 || cMachine.drink4 !== drink4
          || cMachine.drink5 !== drink5 || cMachine.drink6 !== drink6 || cMachine.drink7 !== drink7 || cMachine.drink8 !== drink8
          || cMachine.drink9 !== drink9 || cMachine.drink10 !== drink10 || cMachine.drink11 !== drink11 || cMachine.drink12 !== drink12
          || cMachine.drink13 !== drink13 || cMachine.drink14 !== drink14 || cMachine.drink15 !== drink15 || cMachine.drink16 !== drink16
          || cMachine.drink17 !== drink17 || cMachine.drink18 !== drink18 || cMachine.drink19 !== drink19 || cMachine.drink20 !== drink20
          || cMachine.drink21 !== drink21 || cMachine.drink22 !== drink22 || cMachine.drink23 !== drink23 || cMachine.drink24 !== drink24
          || cMachine.isEnabledDrink1 !== isEnabledDrink1 || cMachine.isEnabledDrink2 !== isEnabledDrink2 || cMachine.isEnabledDrink3 !== isEnabledDrink3 || cMachine.isEnabledDrink4 !== isEnabledDrink4
          || cMachine.isEnabledDrink5 !== isEnabledDrink5 || cMachine.isEnabledDrink6 !== isEnabledDrink6 || cMachine.isEnabledDrink7 !== isEnabledDrink7 || cMachine.isEnabledDrink8 !== isEnabledDrink8
          || cMachine.isEnabledDrink9 !== isEnabledDrink9 || cMachine.isEnabledDrink10 !== isEnabledDrink10 || cMachine.isEnabledDrink11 !== isEnabledDrink11 || cMachine.isEnabledDrink12 !== isEnabledDrink12
          || cMachine.isEnabledDrink13 !== isEnabledDrink13 || cMachine.isEnabledDrink14 !== isEnabledDrink14 || cMachine.isEnabledDrink15 !== isEnabledDrink15 || cMachine.isEnabledDrink16 !== isEnabledDrink16
          || cMachine.isEnabledDrink17 !== isEnabledDrink17 || cMachine.isEnabledDrink18 !== isEnabledDrink18 || cMachine.isEnabledDrink19 !== isEnabledDrink19 || cMachine.isEnabledDrink20 !== isEnabledDrink20
          || cMachine.isEnabledDrink21 !== isEnabledDrink21 || cMachine.isEnabledDrink22 !== isEnabledDrink22 || cMachine.isEnabledDrink23 !== isEnabledDrink23 || cMachine.isEnabledDrink24 !== isEnabledDrink24) {
          await RedisService.updateDrinks({id})
        }
      }catch (e) {
        return exits.serverError({message: `Напитки сохранены но не обновлены на КМ ${e.message}`})
      }

      return exits.success(cm)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
