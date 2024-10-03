/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const debug = process.env.NODE_ENV !== 'production' || process.env.IS_STAGER;

const offers = [
  {
    title: 'Вам 50% кешбэк на первую покупку!',
    description: '50% кешбэк на следующую покупку! Повышенный кешбек со следующей покупки - 50%, будет зачислен на ваш балланс',
    type: 'cashback-50',
  },
  {
    title: 'Кешбэк 100% на следующую покупку!',
    description: '100% кешбэк на следующую покупку! Повышенный кешбек со следующей покупки - 100%, будет зачислен на ваш балланс',
    type: 'cashback-100',
  },
  {
    title: 'Вам чашка кофе в подарок!',
    description: 'Можете заказать через приложение любой напиток - бесплатно!',
    type: 'gift-cap',
  }
]
const sales = [
  {
    title: 'Вам скидка 500 ₽',
    description: 'Для Вас скидка на Абонемент',
    abonement:'63e8a4dec5a328001f60d00c',
    amount:500,
  },
  {
    title: 'Вам скидка 500 ₽',
    description: 'Для Вас скидка на Абонемент',
    abonement:'63e8a4dec5a328001f60d00d',
    amount:500,
  },
  {
    title: 'Вам скидка 500 ₽',
    description: 'Для Вас скидка на Абонемент',
    abonement:'63e8a4dec5a328001f60d00e',
    amount:500,
  }
]

module.exports.bootstrap = async function () {

  AtolService.fetchTokens()
  CacheService.init()
  RedisService.init()
  console.log("isDebug", debug)
  if (!debug) {
    CacheService.fetchRecords()
  }
  // CacheService.fetchRecords()

  /*if(await Manager.count()===0){
    await Manager.create({name:"makweb",role:"superadmin", password:"superadmin", login:"makweb@yandex.ru"}).fetch()
  }*/

 /* if (await Offer.count() === 0) {
    await Offer.createEach(offers)
  }

  if (await Sale.count() === 0) {
    await Sale.createEach(sales)
  }*/

/*  const ab = await Abonement.findOne({type:'gift'})
  const cities = (await City.find().select(['id'])).map(it=>it.id)
  const drinks = (await Drink.find().select(['id'])).map(it=>it.id)
  await Abonement.replaceCollection(ab.id, "cities").members(cities)
  await Abonement.replaceCollection(ab.id, "availableDrinks").members(drinks)*/

  // await CoffeeMachineService.loadLastAnalytics({point:"6399eeceb36d679dd25bf401"})

};
