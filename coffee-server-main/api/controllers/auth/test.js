const fs = require('fs');
const {OrangeData, Order} = require('node-orangedata');
const apiUrl = 'https://api.orangedata.ru:12003/api/v2';
// const apiUrl = 'https://apip.orangedata.ru:2443/api/v2';
// const apiUrl = 'https://apip.orangedata.ru:12001/api/v2';

module.exports = {
  inputs: {
    partner: {
      type: 'string'
    },
    positionData: {
      type: 'json'
    },
    orderData: {
      type: 'json'
    },
  },

  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest',
    },
    forbidden: {
      responseType: 'forbidden',
    },
  },

  fn: async function ({orderData, positionData, partner}, exits) {
    const {inn} = await Partner.findOne({id: partner}).select(['inn'])
    const keyPath = `orange_data_keys/${partner}`
    const cert = fs.readFileSync(`${keyPath}/${inn}.crt`);
    const key = fs.readFileSync(`${keyPath}/${inn}.key`);
    const passphrase = '1234';
    const ca = fs.readFileSync(`${keyPath}/cacert.pem`);
    const privateKey = fs.readFileSync(`${keyPath}/rsa_2048_private_key.pem`);

    console.log("cert", cert)
    console.log("key", key)
    console.log("ca", ca)
    console.log("privateKey", privateKey)

    const order = new Order(orderData);

    order
      .addPosition(positionData)
      .addPayment({type: 2, amount: positionData.price})

    const agent = new OrangeData({
      apiUrl,
      cert,
      key,
      passphrase,
      ca,
      privateKey
    });


   /* const purchase = await Purchase.create(purchaseData)
      .fetch()
    const purchaseId = purchase.id*/

    try {
      const res = await agent.sendOrder(order)
     console.log("res", res)

      //await Purchase.updateOne({id:purchaseId}).set({ status:'accepted', uuid:res.uuid})
    } catch (e) {
      console.log("res er", e)
      console.log( "errrrr", e.message)
      //await Purchase.updateOne({id:purchaseId}).set({error:e.message, status:'error'})
    }

    return exits.success()
  },
}


/*
"60fd31e2dfd161001fb9e11e",
  "60fd31e2dfd161001fb9e11d",
  "60fd31e2dfd161001fb9e11c",
  "60fd31e2dfd161001fb9e11b",
  "60fd31e2dfd161001fb9e11a",
  "60fd31e2dfd161001fb9e119",
  "60fd31e2dfd161001fb9e118",
  "60fd31e2dfd161001fb9e117"*/
