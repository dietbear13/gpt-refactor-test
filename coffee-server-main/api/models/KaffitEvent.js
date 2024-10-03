const moment = require('moment');

module.exports = {
  attributes: {
    coffeeMachine: {
      model: 'coffeemachine',
    },
    type: {
      type: 'string',
      isIn: ['info', 'warn', 'error'],
    },
    message: {
      type: 'string'
    },
    isRead:{
      type: 'boolean',
      defaultsTo: false
    },
    updatedAt: false,
  },

  afterCreate: async function (newRecord, proceed) {
    CacheService.updateLog(newRecord)
    return proceed();
  },
}
