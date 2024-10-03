module.exports = {
  attributes: {
    type: {
      type: 'string', //ingredients
    },
    message: {
      type: 'string',
    },
    point: {
      model: 'coffeepoint'
    },
    managers: {
      collection: 'manager',
      via: 'messages'
    },
    isSended:{
      type: 'boolean',
      defaultsTo:false
    },
  },

  async isNotSend({point, type}) {
    let c = await Message.count({point, type, createdAt: {">=": Date.now() - 60 * 60 * 1000}})
    return c === 0
  },

  async createAndSend({point, message, type}) {

    let isNotSend = await Message.isNotSend({point, type})

    if(!isNotSend) return

    let {managers, coffeeMachine} = await CoffeePoint.findOne({id:point}).select(["id", "coffeeMachine"])
      .populate("managers", {where: {"notifications.type": "service-volumes"}, select: ["telegramId"]})
      .meta({enableExperimentalDeepTargets: true})

    let manIds = managers.map(it => it.id)

    let isWork =await CoffeePoint.isWork({id:point})
    const status = await CoffeeMachine.milkStatus({id:coffeeMachine})

    const msg = `Молочные напитки - <b>${status ?'Включены' : 'Отключены' }</b>\n` + message
    let m = await Message.create({point: point, type: "ingredients", message, isSended: isWork }).fetch()
    await Message.addToCollection(m.id, "managers").members(manIds)

    BotService.sendLowNotification({ msg, managers:manIds, coffeeMachine})
  },

}
