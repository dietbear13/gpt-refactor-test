const ax = require('axios');
const axios = ax.create({
  baseURL: `https://online.atol.ru/possystem/v4/`
});

const tokenMap = new Map();

const obtainToken = async ({id, credentials}) => {
  let {data} = await axios.get('getToken', { params: { login: credentials.login, pass:credentials.password } });
  tokenMap.set(id, data);
  return {id, data}
};

const getToken = (partner) => {
  return tokenMap.get(partner)?.token
}

module.exports = {
  async fetchTokens() {

    const creds = (await Partner.find({isArchive: false}).select(["atolCredentials"]))
      .map(it => ({id: it.id, credentials: it.atolCredentials}))
      .filter(it => it.credentials && it.credentials.password && it.credentials.password !== "");

    (await Promise.allSettled(creds.map(it => obtainToken(it))))
      .filter(it => it.status === 'fulfilled')
      .map(it => it.value)
      .forEach(it=>{
        tokenMap.set(it.id, it.data)
      })
    sails.log.warn("tokens " , tokenMap)
  },


  async sendPurchase({partner, purchaseData}){
    const pr = await Partner.findOne({id: partner}).select(["atolCredentials"]);
    Logger.purchaseInfo("purchaseData ", JSON.stringify(purchaseData), partner)
    const {data} = await axios.post(`${pr.atolCredentials.groupCode}/sell?token=${getToken(partner)}`, purchaseData)
    return data
  }
}
