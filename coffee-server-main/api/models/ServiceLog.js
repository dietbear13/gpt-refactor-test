const moment = require('moment');

module.exports = {
  attributes: {
    point: {
      model: 'coffeepoint',
    },
    manager: {
      model: 'manager',
    },
    type: {
      type: 'string',
      isIn: ['milk', 'water', 'coffee','milk-drop','water-drop', "milk-enable", 'milk-disable'],
    },
    value: {
      type: 'number'
    },
    updatedAt: false
  },

  async createOrUpdate({point, manager, type, value, owner}) {
    let logs = await ServiceLog.find({
      where: {point, type, manager},
      select: ['createdAt'],
      limit: 1,
      sort: 'createdAt DESC'
    })

    let log = logs[0]

    if (!log) {
      await ServiceLog.create({point, manager, type, value, owner}).fetch()
      return
    }

    let m = moment.utc(log.createdAt).format('HH:mm DD-MM-YY')
    let now = moment.utc().format('HH:mm DD-MM-YY')

    if (m === now) {
      await ServiceLog.updateOne({id:log.id}).set({value})
    } else {
      await ServiceLog.create({point, manager, type, value, owner}).fetch()
    }
  },

  async lastVisit({point}) {
    let logs = await ServiceLog.find({
      where: {point},
      select: ['createdAt', 'point'],
      limit: 1,
      sort: 'createdAt DESC'
    })
      .populate("manager")

    return logs[0] ? {lastVisit:logs[0].createdAt, point: logs[0].point, manager:logs[0]?.manager?.name} : null
  },

  afterCreate: async function (newRecord, proceed) {
    const man = await Manager.findOne({id:newRecord.manager}).select(['name'])
    CacheService.updateLastVisit({lastVisit:newRecord.createdAt, point: newRecord.point, manager:man?.name})
    return proceed();
  },


}
