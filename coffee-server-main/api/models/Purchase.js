module.exports = {
  attributes: {
    status: {
      type: 'string',
      isIn: ['pending', 'accepted', 'success','error'],
      defaultsTo:'pending'
    },
    externalId: {
      type: 'string',
      unique: true
    },
    title:{
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    pinpadSin: {
      type: 'string',
    },
    authCode: {
      type: 'string',
    },
    operationId:{
      type: 'string',
    },
    ofdUrl: {
      type: 'string',
      allowNull:true,
    },
    sin: {
      type: 'string',
    },
    uuid: {
      type: 'string',
      allowNull:true,
    },
    payload:{
      type:'json'
    },
    error:{
      type:'string',
      allowNull: true
    },
    coffeeMachine: {
      model: 'coffeemachine',
    },

    point: {
      model: 'coffeepoint',
    },
    drink: {
      model: 'drink',
    },
    partner:{
      model:'partner'
    },
    snapshotAt:{
      type:'number'
    },
  },

};
