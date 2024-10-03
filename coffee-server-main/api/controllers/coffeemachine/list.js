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

    const [cities, partners, points] = (await Promise.all([
      City.find(owner).select(['id',"title"]),
      Partner.find(owner).select(['id',"title"]),
      CoffeePoint.find(owner).select(['id',"title","city"])
    ]))
      .map(it => it.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {}));


    // const counters = CacheService.getLogs()

    try {
      let machines = await CoffeeMachine.find(owner)

      machines = await Promise.all(machines
        .map(it => _.pick(it,['id','sin', 'controllerId', 'partner', 'point', 'status']))
        .map(async (it) => {
          let sin = it.sin ?? it.controllerId
          it.sin = sin
          it.city = it.point ? cities[points[it.point]?.city] : null
          it.point = it.point ? points[it.point] : null
          it.partner = partners[it.partner];
          it.status = await CacheService.getStatusBySin(sin)
          /*it.counters = counters[it.id] ?? {
            info: 0,
            warn: 0,
            error: 0
          }*/
          it.counters = {
            info: 0,
            warn: 0,
            error: 0
          }
          return it;
        }))

      return exits.success(machines);
    } catch (err) {
      sails.log.error(err);
      return exits.serverError(err);
    }
  }
};
