const {OrangeData, Order} = require('node-orangedata');
const apiUrl = 'https://apip.orangedata.ru:2443/api/v2'; //test-api
var fs = require('fs');


module.exports = {
  async sendPurchase({partner, orderData, positionData}) {
    const { inn } = await Partner.findOne({id: partner}).select(['inn'])

    const keyPath = `orange_data_keys/${partner}`
    const cert = fs.readFileSync(`${keyPath}/${inn}.crt`);
    const key = fs.readFileSync(`${keyPath}/${inn}.key`);
    const passphrase = '1234';
    const ca = fs.readFileSync(`${keyPath}/cacert.pem`);
    const privateKey = fs.readFileSync(`${keyPath}/private_key.pem`);

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

    await agent.sendOrder(order)
  }
}
