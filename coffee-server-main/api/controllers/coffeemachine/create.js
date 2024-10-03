module.exports = {

  inputs: {
    partner: {
      type: 'string',
      require: true
    },
    sin: {
      type: 'string',
      require: true
    },
    point: {
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
    forbidden: {
      responseType: 'forbidden'
    },
    serverError: {
      responseType: 'serverError'
    },
  },


  fn: async function ({partner, sin, point}, exits) {
    try {

      // if(await CoffeeMachine.count({sin})>0) return exits.badRequest({message:"уже существует КМ с серийным номером " + sin})
      let {owner} = await Partner.findOne({id: partner}).select(["owner"])

      const machine = await CoffeeMachine.create({
        partner,
        sin: sin?.trim(),
        point,
        owner,
        flushingVolume:130,
        flushingMilkVolume:60
      }).fetch()


      if (point) {
        const {coffeeMachine} = await CoffeePoint.findOne({id: point}).select(['coffeeMachine'])
        if (coffeeMachine) {
          await CoffeeMachine.updateOne({id: coffeeMachine}).set({point: null})
        }
        await CoffeePoint.updateOne({id: point}).set({coffeeMachine: machine.id})
      }


      const [cities, partners, points] = (await Promise.all([City.find().select(['title']), Partner.find().select(['title']), CoffeePoint.find().select(['title', 'city'])]))
        .map(it => it.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {}));

      let m = await CoffeeMachine.findOne({id: machine.id})
      m.city = m.point ? cities[points[m.point].city] : null
      m.point = m.point ? points[m.point] : null
      m.partner = partners[m.partner];
      return exits.success(m)
    } catch (err) {
      sails.log.error(err)
      return exits.serverError(err)
    }
  }
};
