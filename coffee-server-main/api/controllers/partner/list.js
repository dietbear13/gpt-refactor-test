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
      responseType: 'badRequest',
    },
    serverError: {
      responseType: 'serverError',
    },
  },

  fn: async function ({lastUpdate}, exits) {
    try {
      let partners = await Partner.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner})
      let points = (await CoffeePoint.find(this.req.isSuperAdmin ? {} : {owner:this.req.owner}))
        .reduce((acc, cur) => {
          if (acc[cur.partner]) {
            acc[cur.partner].push(cur.id)
          } else {
            acc[cur.partner] = [cur.id]
          }
          return acc;
        }, {})
      const profits = CacheService.getProfits()

      partners = partners.map(it => {
        it.points = points[it.id]?.length ?? 0
        it.currentSale = points[it.id]?.reduce((acc, cur) => {
          acc = acc + profits[cur]?.sale
          return acc
        }, 0) ?? 0
        it.currentProfit = points[it.id]?.reduce((acc, cur) => {
          acc = acc + profits[cur]?.profit
          return acc
        }, 0) ?? 0
        return _.omit(it,["phone","inn", "credentials", "createdAt","updatedAt"])
      })

      exits.success(partners)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  },
}
