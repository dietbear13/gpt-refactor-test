module.exports = {

  inputs: {
    title: {
      type: 'string',
      required: true
    },
    city: {
      type: 'string',
      required: true
    },
    partner: {
      type: 'string',
      required: true
    },
    street: {
      type: 'string',
    },
    house: {
      type: 'string',
    },
    howFind: {
      type: 'string',
    },
    coffeeMachine: {
      type: 'string',
      allowNull: true
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


  fn: async function ({title, city, howFind, partner, street, house, coffeeMachine}, exits) {

    try {
      let {owner} = await Partner.findOne({id: partner}).select(["owner"])
      let {id} = await CoffeePoint.create({
        title,
        city,
        howFind,
        partner,
        street,
        house,
        owner,
        coffeeMachine
      }).fetch()

      if (coffeeMachine) {
        const {point:cPoint} = await CoffeeMachine.findOne({id:coffeeMachine}).select(["point"])
        if(cPoint) {
          await CoffeePoint.updateOne({id:cPoint}).set({coffeeMachine:null})
        }
        await CoffeeMachine.updateOne({id: coffeeMachine}).set({point: id})
      }

      let point = await CoffeePoint.findOne({id})
        .select(['title', 'city', 'partner', 'coffeeMachine', 'nominalCoffee', 'nominalMilk', 'nominalWater', 'currentCoffee', 'currentMilk', 'currentWater', 'currentProfit'])
        .populate("city")
        .populate("partner")
        .populate("coffeeMachine")


      point.city = _.pick(point.city, ["id", "title"])
      point.partner = _.pick(point.partner, ["id", "title"])
      point.status = point.coffeeMachine?.status || 'Hет КМ'
      return exits.success(point);
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
}
