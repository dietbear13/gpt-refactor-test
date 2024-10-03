const moment = require('moment');

module.exports = {
  attributes: {
    title: {
      type: 'string',
      unique: true
    },
    phone: {
      type: 'string',
    },
    inn: {
      type: 'string',
    },
    balance: {
      type: 'number',
      defaultsTo: 0
    },
    costPerUnit: {
      type: 'number',
      defaultsTo: 500
    },
    tariff: {
      type: 'string',
      isIn:['min','optimal','max'],
      defaultsTo: 'min'
    },
    transactions: {
      collection: 'partnertransaction',
      via: 'partner',
    },
    email: {
      type: 'string',
      unique: true
    },
    atolCredentials: {
      type: 'json',
      defaultsTo: {
        kpp: "",
        company: "",
        hostname: "",
        groupCode: "",
        password: "",
        login: "",
      }
    },
    orangeCredentials:{
      type: 'string'
    },
    cities: {
      collection: 'city',
      via: 'partners',
    },
    points: {
      collection: 'coffeepoint',
      via: 'partner'
    },
    isEnabledDailyCost: {
      type: 'boolean',
      defaultsTo: false,
    },
    isArchive: {
      type: 'boolean',
      defaultsTo: false
    },
    cloudKassa: {
      type: 'string',
      isIn:['atol','orangeData'],
      defaultsTo: 'atol'
    }
  },

  afterCreate: async function (newRecord, proceed) {
    const {cities} = await Partner.findOne({id: newRecord.id})
      .select(["id"])
      .populate("cities", {select: ["id", "title"]})
    newRecord.cities = cities
    CacheService.updatePartner(newRecord)

    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    const {cities} = await Partner.findOne({id: updatedRecord.id})
      .select(["id"])
      .populate("cities", {select: ["id", "title"]})
    updatedRecord.cities = cities
    CacheService.updatePartner(updatedRecord)
    return proceed();
  },

  afterDestroy: async function (updatedRecord, proceed) {
    CacheService.removePartner(updatedRecord)
    await Manager.destroyOne({partner: updatedRecord.id})
    await CoffeePoint.update({partner: updatedRecord.id}).set({isArchive: true, partner: null})
    await Drink.update({partner: updatedRecord.id}).set({isArchive: true, partner: null})
    return proceed();
  },

  async dailyProfit({id}) {
    let startDay = moment().startOf("day").unix()

    let cp = await CoffeePoint.find({partner: id}).select(["id"])
    let ids = cp.map(it => it.id)

    let stats = await ProfitStatistic.find({point: {in: ids}, snapshotAt: {">=": startDay}}).select(["profit"])

    return stats
      .map(it => it.profit)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  },

  async findFull({id}) {
    let partner = await Partner.findOne({id}).decrypt()
      .populate("cities", {select: ["title"]})
      .populate("points", {select: ["title"]})

    partner.managers = await Manager.find({partner: partner.id}).select(["name"])
    partner.usageCost = await Partner.usageCost({id})

    return partner
  },

  findTz: async function (id) {
    const partner = await Partner.find({id}).populate("cities")

    return (partner.cities && partner.cities.length > 0) ? partner.cities[0].tz : 'Europe/Moscow'
  },

  async upBalance({id, title, type, amount}) {
    const part =  await Partner.findOne({id}).select(['balance'])
    await PartnerTransaction.create({partner:id, type, title, amount}).fetch()
    const uppart = await Partner.updateOne({id}).set({balance: part.balance + amount})
    return uppart
  },

  async downBalanceDaily({id}) {
    const part =  await Partner.findOne({id}).select(['balance'])
    const cost = await Partner.usageCost({id})
    await PartnerTransaction.create({partner:id, type:"dailySpend", title:"Ежедневное обслуживание", amount: -cost}).fetch()
    const uppart = await Partner.updateOne({}).set({balance: part.balance - cost})
    return uppart
  },

  async usageCost({id}){
    const {costPerUnit} = await Partner.findOne({id}).select(['costPerUnit'])
    const cmcount = await CoffeeMachine.count({partner:id, point:{"!=": null}})
    return Math.round((cmcount*costPerUnit)/moment().daysInMonth())
  }
}

