module.exports = {
  attributes: {
    title: {
      type: 'string',
    },
    short: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    externalKey: {
      type: 'string',
    },
    skladId: {
      type: 'string',
    },
    minQuantity:{
      type: 'number',
      defaultsTo:1
    },
    maxPrice:{
      defaultsTo: 0,
      type: 'number',
    },
    stock:{
      defaultsTo: 0,
      type: 'number',
    },
    reserve:{
      defaultsTo: 0,
      type: 'number',
    },
    isActive:{
      type: 'boolean',
      defaultsTo: true
    },
    value:{
      defaultsTo: 0,
      type: 'number',
    },
    consumption:{
      defaultsTo: 1,
      type: 'number',
    },
    type:{
      type: 'string',
      isIn:['coffee', 'stick', 'cup', 'cap','sugar','syrup', 'milk']
    },
    unit: {
      type: 'string',
    },
    valueUnit: {
      type: 'string',
    },
    isCustom: {
      type: 'boolean',
      defaultsTo: false,
    },
    customPrice: {
      type: 'number',
      defaultsTo: 0,
    },
    partner: {
      model: 'partner',
    },
  },
};
