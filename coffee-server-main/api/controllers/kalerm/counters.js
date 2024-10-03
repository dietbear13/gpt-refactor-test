const moment = require('moment-timezone');

module.exports = {

  inputs: {
    counters: {
      type: 'json',
      required: true
    },
    snapshotAt:{
      type: 'number',
      required: true
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


  fn: async function ({counters, snapshotAt}, exits) {
    try {

      const coffeeMachine = this.req.id

      const cm = await CoffeeMachine.findOne({id:coffeeMachine})

      const drinks = (await Drink.find({id: [
          cm.drink1, cm.drink2, cm.drink3, cm.drink4, cm.drink5, cm.drink6, cm.drink7, cm.drink8,
          cm.drink9, cm.drink10, cm.drink11, cm.drink12, cm.drink13, cm.drink14, cm.drink15, cm.drink16,
          cm.drink17, cm.drink18, cm.drink19, cm.drink20, cm.drink21, cm.drink22, cm.drink23, cm.drink24
        ]}).select(['slug'])).reduce((acc, cur)=>{
        acc[cur.slug] = cur.id
        return acc
      }, {})


      const emptyCounters = {}

      for (const prop in counters) {
        let drink = drinks[prop];
        if(drink) emptyCounters[drink] = counters[prop]
        else {
          const drinkId = await Drink.findOne({tier:"level-dc", slug: prop }).select(['id'])
          if(drinkId) emptyCounters[drinkId.id] = counters[prop]
        }
      }
      sails.log.warn("updare counters", emptyCounters, counters)
      // await CoffeeMachine.updateOne({id:coffeeMachine}).set({counters:emptyCounters})
      await KaffitEvent.create({
        type: 'info',
        coffeeMachine: coffeeMachine,
        owner:this.req.owner,
        message: `Значения счетчиков обновлены, локальное время: ${moment(snapshotAt).tz(this.req.tz).format("HH:mm:ss DD.MM.YY")}`
      }).fetch()
      exits.success()
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};

/*
sdk_k95_drink_item_04__300: 0,
sdk_k95_drink_item_06__300: 0,
sdk_k95_drink_item_105__200: 0,
sdk_k95_drink_item_02__300: 0,
sdk_k95_drink_item_03__: 0,
sdk_k95_drink_item_04__200: 0,
sdk_k95_drink_item_06__200: 0,
sdk_k95_drink_item_01__50: 0,
sdk_k95_drink_item_02__150: 0,
sdk_k95_drink_item_104__null: 0,
sdk_k95_drink_item_131__null: 0,
sdk_k95_drink_item_double_01__null: 0,
sdk_k95_drink_item_double_04__null: 0,
sdk_k95_drink_item_double_06__null: 0,
sdk_k95_drink_item_double_05__null: 0,
sdk_k95_drink_item_double_105__null: 0,
sdk_k95_drink_item_double_101__null: 0,
sdk_k95_drink_item_double_111__null: 0,
sdk_k95_drink_item_double_104__null: 0,
sdk_k95_drink_item_double_131__null: 0,
sdk_k95_drink_item_03__null: 0,
sdk_k95_drink_item_07__null: 0,
sdk_k95_drink_item_08__null: 0,
sdk_k95_drink_item_121__null: 3*/
