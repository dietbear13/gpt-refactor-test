module.exports = {

  inputs: {
    lastUpdate: {
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


  fn: async function ({lastUpdate}, exits) {
    const owner = this.req.isSuperAdmin ? {} : {owner:this.req.owner}

    const [cities, partners, coffeeMachines] = (await Promise.all([
      City.find(owner).select(['id','title', "tz"]),
      Partner.find(owner).select(['id','title']),
      CoffeeMachine.find(owner).select(["id",'status'])
    ]))
      .map(it => it.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {}));

    const profits = CacheService.getProfits()
    try {
      let points = (await CoffeePoint.find(owner))
        .map(it => _.pick(it,['id','title', 'city', 'partner', 'coffeeMachine', 'nominalCoffee', 'nominalMilk', 'nominalWater', 'currentCoffee', 'currentMilk', 'currentWater','isArchive']))
        .map((it) => {
        it.currentProfit = profits[it.id]?.profit || 0
        it.city = cities[it.city];
        it.partner = partners[it.partner];
        it.status = coffeeMachines[it.coffeeMachine]?.status || 'Hет КМ'
        return it;
      });

      return exits.success(points);
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
