const debug = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'HNAsBCXtg5ts4NFDsAtFs8YXZfKOTYeBmrFWqpFcTOnsHSRX14MN3eDat0AuVL5nDmDqQFLCs0sT09iLQpddsTpTueXtAmstmsTVTIYXE5ZBYoedYZQ8tiJWsXfPA64JGuXtXCJKDAT45FGNeqpi4dJssBQAPHDPAt2TosCDfDZHtPsTQE59XDuime5toQDFR3pBIBtE0ricL3dcdGiSoSfmWBcniNeBieCmcBBqJTGuOZoioPGsBb5MpPseQuOG';
const REDIS_USER = process.env.REDIS_USER || 'redis';
const crypto = require('crypto').webcrypto;
const redis = require('redis');

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


let client;

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const init = async () => {
  console.log(`REDIS_USER ${REDIS_USER} client for publish`);
  client = redis.createClient({
    url: !debug ? `redis://:${REDIS_PASSWORD}@cache:${REDIS_PORT}` : `redis://:${REDIS_PASSWORD}@crm.dobryicoffee.ru:${REDIS_PORT}`,
  })

  client.on('disconnect', () => sails.log.warn('Redis Client disconnect'))
  client.on('ready', () => sails.log.warn('Redis ready client'))
  client.on('error', (err) => sails.log.error('Redis Client Error', err))

  await client.connect();
  setInterval( async () => {await client.ping()}, 60000)
};

const checkSubscriber = async (sin) => {
  const info = (await client.sendCommand(['CLIENT', 'LIST'])).split('\n');
  console.log("info clients", info)
  const regExp = new RegExp('(?<=name=)' + sin);
  return info.some(it => regExp.test(it));
  // return true
};

const publish = async ({topic, data, timeout = 30000}) => {


  return new Promise(async (resolve, reject) => {
    if (!await checkSubscriber(topic)) {
      return reject(new Error('subscribers not found by name'));
    }

    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(topic + '_res', async (message) => {
      console.log('response', message); //
      try {
        await subscriber.quit();
      } catch (e) {

      }
      resolve(JSON.parse(message));
    });

    const res = await client.publish(topic, JSON.stringify(data));
    console.log('publish', res);
    if (res === 0) {
      try {
        await subscriber.unsubscribe(topic + '_res');
        await subscriber.quit();
      } catch (e) {

      }
      reject(new Error('subscribers not found'));
    }

    await delay(timeout);
    reject(new Error(`timeout after ${timeout} ms`));

  });
};

const cook = async ({id, drink, isTest}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  return await RedisService.publish({topic: cm.sin, data: {id: uuidv4() + ':api', drink, type: 'cook', isTest}});
};

const pinpadMode = async ({id, isEnabled}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  return await RedisService.publish({topic: cm.sin, data: { type: 'pinpadMode', isEnabled}});
};

const updateDrinks = async ({id}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  const data = await CoffeeMachine.findKalermDrinks({id});
  return await RedisService.publish({topic: cm.sin, data: {type: 'updateDrinks', ...data}});
};

const newReceipt = async ({sin, url, id}) => {
  try {
    await RedisService.publish({topic: sin, data: {type: 'receipt', url, id}});
  }catch (e) {
    sails.log.error(e)
  }

};

const status = async ({id}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  return await RedisService.publish({topic: cm.sin, data: {type: 'status'}});
};

const version = async ({id}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  return await RedisService.publish({topic: cm.sin, data: {type: 'version'}});
};

const updateApp = async ({id, url}) => {
  const cm = await CoffeeMachine.findOne({id}).select(['sin']);
  return await RedisService.publish({topic: cm.sin, data: {type: 'updateApp', url}});
};

module.exports = {
  init,
  publish,
  cook,
  updateDrinks,
  newReceipt,
  pinpadMode,
  status,
  version,
  updateApp
};



