const notifications = [
  {
    type:"sales-trouble",
    title:"Нет продаж"
  },
  {
    type:"service-volumes",
    title:"Низкий запас ингредиентов"
  },
  {
    type:"point-error",
    title:"Ошибка на точке"
  },
  {
    type:"point-not-connect",
    title:"Нет связи"
  },
]

const permissions = [
  {
    type:"sales",
    title:"Просмотр финансовой статистики"
  },
  {
    type:"service",
    title:"Обслуживание точек"
  },
  {
    type:"volumes",
    title:"Просмотр остатков"
  },
]


module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    phone: {
      type: 'string',
      unique: true
    },
    login: {
      type: 'string',
      unique: true
    },
    password:{
      type: 'string',
      encrypt: true,
      allowNull: true
    },
    role:{
      type: 'string',
      defaultsTo:"customer"
    },
    permissions:{
      type: 'json',
      defaultsTo:[]
    },
    notifications:{
      type: 'json',
      defaultsTo:[]
    },
    partner:{
      model: 'partner'
    },
    telegramId:{
      type: 'number',
    },
    telegramName:{
      type: 'string',
    },
    points:{
      collection: "coffeepoint",
      via: "managers"
    },
    messages: {
      collection: 'message',
      via: 'managers'
    },
  },
  notifications,
  permissions,

  afterCreate: async function (newRecord, proceed) {
    CacheService.updatePermissions(newRecord);

    const defaultFormulas = DrinkFormula.defaultFormulas()
    const defaultDrinks = Drink.defaultDrinks()

    for (const formula in defaultFormulas) {
      const coffee = defaultFormulas[formula].coffeeAmount
      const title = defaultDrinks.find(it => it.formula === defaultFormulas[formula].sdk).title

      const {id} = await Drink.create({ title, price: 100, costPrice: 50, coffee, partner: newRecord.partner, owner: newRecord.owner }).fetch()
      const {id: formulaId} = await DrinkFormula.create({...defaultFormulas[formula], drink: id}).fetch()
      await Drink.updateOne({id}).set({formula: formulaId})
    }
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    CacheService.updatePermissions(updatedRecord);
    return proceed();
  },

  async findFull({id}){
    let man = await Manager.findOne({id}).decrypt()
      .populate("partner")
      .populate("points", {select:["title"], where:{isArchive:false}})

    man.partner = _.pick(man.partner, ["title", "id"])
    return man
  },
}


