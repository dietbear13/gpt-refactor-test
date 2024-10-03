const moment = require('moment')

module.exports = {

  inputs: {
    id: {
      type: 'string',
      required:true
    },
    city: {
      type: 'string',
      // required:true
    },
    partner: {
      type: 'string',
      // required:true
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    street: {
      type: 'string',
    },
    house: {
      type: 'string',
    },
    geo: {
      type: 'json',
    },
    howFind: {
      type: 'string',
    },
    schedule: {
      type: 'json',
      defaultsTo: {
        mon: "9:00 - 20:00",
        tue: "9:00 - 20:00",
        wed: "9:00 - 20:00",
        thu: "9:00 - 20:00",
        fri: "9:00 - 20:00",
        sat: "Выходной",
        sun: "Выходной",
      }
    },
    nominalWater: {
      type: 'number',
      defaultsTo: 19000
    },
    nominalMilk: {
      type: 'number',
      defaultsTo: 4000
    },
    nominalCoffee: {
      type: 'number',
      defaultsTo: 1500
    },
    isAppShow: {
      type: 'boolean',
      defaultsTo: true
    },
    rentalPrice: {
      type: 'number',
      defaultsTo: 0
    },
    costCoffeeShop: {
      type: 'number',
      defaultsTo: 0
    },
    costLaunch: {
      type: 'number',
      defaultsTo: 0
    },
    dateMount: {
      type: 'string'
    },
    drinks: {
      type: 'json'
    },
    coffeeMachine: {
      type: 'string',
      allowNull: true
    },
    images: {
      type: 'json',
      defaultsTo: []
    },
    isArchive: {
      type: 'boolean',
    },
    cashbackPercent: {
      type: 'number',
    },
    isDemo: {
      type: 'boolean',
      defaultsTo: false
    },
    demoTitle: {
      type: 'string',
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


  fn: async function (inputs, exits) {
    try {
      let {
        id,title,description,city,street,house,geo,howFind,schedule,partner,nominalWater,nominalMilk,nominalCoffee,isAppShow,
        coffeeMachine,images,isArchive,cashbackPercent, isDemo, demoTitle
      } = inputs

      let {owner} = await Partner.findOne({id: partner}).select(["owner"])
      const {coffeeMachine: m} = await CoffeePoint.findOne({id}).select(["coffeeMachine"])

      if(m && m !== coffeeMachine) {
        await CoffeeMachine.updateOne({id:m}).set({point:null})
        await CoffeeMachine.updateOne({id:coffeeMachine}).set({point:id})
      }

      await CoffeePoint.updateOne({id}).set({
        title,
        description,
        city,
        street,
        house,
        geo,
        howFind,
        schedule,
        partner,
        owner,
        nominalWater,
        nominalMilk,
        nominalCoffee,
        isAppShow,
        coffeeMachine,
        images,
        isArchive,
        cashbackPercent,
        isDemo,
        demoTitle
      })

      let point = await CoffeePoint.findFull({id})
      return exits.success(point)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
