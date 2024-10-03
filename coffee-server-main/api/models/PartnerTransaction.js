module.exports = {
  attributes: {
    title: {
      type: 'string'
    },
    partner: {
      model: 'partner',
    },
    type: {
      type: 'string',
      isIn:['manualIncoming', 'dailySpend', 'online']
    },
    amount: {
      type: 'number',
      defaultsTo:0
    },
  },
};
