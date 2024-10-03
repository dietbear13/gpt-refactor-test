const https = require('https');
const ax = require('axios');
const querystring = require('querystring');
const token = 'si0v0q8evhlhm45j5n7g7ph8qf';
const axios = ax.create({
  baseURL: `https://securepayments.sberbank.ru/payment/rest/`,
  timeout: 30000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const createPaymentLink = async ({amount, orderId, type = 'abonement'}) => {
  return await axios.post('register.do', querystring.stringify({
    token: token,
    amount: amount * 100,
    returnUrl: 'https://dobryicoffee.ru/payment/success',
    failUrl: 'https://dobryicoffee.ru/payment/fail',
    orderNumber: orderId,
    dynamicCallbackUrl: `https://crm.dobryicoffee.ru/api/v2/payment/${type}/${orderId}`
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

const createPartnerOrder = async ({amount, partner}) =>{
  const pab = await PendingPartnerPayment.create({title : `Оплата обслуживания - ${amount}руб`, amount, partner}).fetch();

  const {data: {formUrl, orderId}} = await createPaymentLink({amount, orderId: pab.id, type: 'partner'});
  await PendingPartnerPayment.updateOne({id: pab.id}).set({formUrl, orderId});
  return formUrl;
}

module.exports = {
  createPartnerOrder
};
