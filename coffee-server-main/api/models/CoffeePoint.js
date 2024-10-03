const moment = require('moment-timezone');

const groupByKeys = function (stats, keys) {
  let gr = _.groupBy(stats, (it) => it.point);
  keys.forEach(k => {
    if (!gr[k]) {
      gr[k] = [];
    }
  });
  return gr;
};

const groupByTitles = function (stats, keys) {
  let gr = _.groupBy(stats, (it) => it.title);
  keys.forEach(k => {
    if (!gr[k]) {
      gr[k] = [];
    }
  });
  return gr;
};


module.exports = {
  attributes: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    city: {
      model: 'city',
    },
    street: {
      type: 'string',
    },
    house: {
      type: 'string',
    },
    geo: {
      type: 'json',
      defaultsTo: {
        lat: null,
        long: null
      }
    },
    howFind: {
      type: 'string',
    },
    sin: {
      type: 'string',
      defaultsTo: ""
    },
    schedule: {
      type: 'json',
      defaultsTo: {
        mon: '9:00 - 20:00',
        tue: '9:00 - 20:00',
        wed: '9:00 - 20:00',
        thu: '9:00 - 20:00',
        fri: '9:00 - 20:00',
        sat: 'Выходной',
        sun: 'Выходной',
      }
    },
    partner: {
      model: 'partner',
    },
    currentWater: {
      type: 'number',
      defaultsTo: 0
    },
    currentMilk: {
      type: 'number',
      defaultsTo: 0
    },
    currentCoffee: {
      type: 'number',
      defaultsTo: 0
    },
    nominalWater: {
      type: 'number',
      defaultsTo: 19000
    },
    nominalMilk: {
      type: 'number',
      defaultsTo: 5000
    },
    nominalCoffee: {
      type: 'number',
      defaultsTo: 1000
    },
    managers: {
      collection: 'manager',
      via: 'points'
    },
    isAppShow: {
      type: 'boolean',
      defaultsTo: true
    },
    rentalPrice: {
      type: 'number',
      defaultsTo: 0
    },
    costCoffeeShop: {
      type: 'number',
      defaultsTo: 0
    },
    costLaunch: {
      type: 'number',
      defaultsTo: 0
    },
    dateMount: {
      type: 'number'
    },
    coffeeMachine: {
      model: 'coffeemachine',
    },
    currentProfit: {
      type: 'number',
      defaultsTo: 0
    },
    lastStatistic: {
      type: 'string',
      allowNull: true
    },
    lastFlushing: {
      type: 'number',
      defaultsTo: 0
    },
    images: {
      type: 'json',
      defaultsTo: []
    },
    cashbackPercent: {
      type: 'number',
      defaultsTo: 10
    },
    isArchive: {
      type: 'boolean',
      defaultsTo: false
    },
    isDemo: {
      type: 'boolean',
      defaultsTo: false
    },
    demoTitle: {
      type: 'string',
      defaultsTo: ""
    },
    nextMilkDrop: {
      type: 'number',
    },
    changeMilkHours: {
      type: 'number',
      defaultsTo: 72
    },
    availableProductsType: {
      type: 'json',
      defaultsTo: [ 'stick', 'cup', 'cap','sugar','syrup']
    },
    unavailableProductsType: {
      type: 'json',
      defaultsTo: ['coffee', 'milk']
    }
  },

  customToJSON() {
    return _.omit(this, ['owner']);
  },

  async isWork({id}) {
    try {
      let {city: {tz}, schedule} = await CoffeePoint.findOne({id}).select(['schedule'])
        .populate('city');

      const days = [
        'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',
      ];
      let mom = moment().tz(tz);
      let day = days[mom.day()];

      let daySh = schedule[day];
      if (daySh === 'Выходной') {
        return false;
      } else if (daySh === 'Круглосуточно') {
        return true;
      } else {
        let res = /^(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})$/.exec(daySh);
        let sh = parseInt(res[1]);
        let sm = parseInt(res[2]);
        let eh = parseInt(res[3]);
        let em = parseInt(res[4]);

        let start = mom.clone().set({hour: sh, minute: sm});
        let end = mom.clone().set({hour: eh, minute: em});

        return mom.isBetween(start, end);

      }
    } catch (e) {
      sails.log.error('Некорректно указаны рабочие дни торговой точки', id, e.message);
      return false;
    }


  },

  async calculateConsumption({id, drink}) {
    sails.log.warn("calculateConsumption ")
    let {
      title: drinkTitle,
      water,
      milk,
      coffee
    } = await Drink.findOne({id: `${drink}`}).select(['water', 'milk', 'coffee', 'title']);

    let {
      title,
      currentWater,
      currentMilk,
      currentCoffee,
      coffeeMachine,
      owner
    } = await CoffeePoint.findOne({id}).select(['title', 'currentWater', 'currentMilk', 'currentCoffee', 'nominalWater', 'nominalMilk', 'nominalCoffee', 'coffeeMachine', 'owner'])
    let up = await CoffeePoint.updateOne({id}).set({
      currentWater: currentWater - water,
      currentMilk: currentMilk - milk,
      currentCoffee: currentCoffee - coffee
    });

    await KaffitEvent.create({
      type: 'info',
      coffeeMachine: coffeeMachine,
      owner,
      message: `Списание ингредиентов для напитка ${drinkTitle} - вода: ${water}мл, молоко: ${milk}мл, кофе: ${coffee}гр`
    }).fetch()

    const {products} = await Storage.findOne({point:id}).select(['products'])

    if(products.length>0){

      let msg = `Списание расходников для напитка ${drinkTitle} - `

      const prds = await Product.find({id:products.map(it=>it.id), owner:['superadmin', owner ]}).select(['title','type','value','consumption'])

      const prMap = products.reduce((acc, cur)=>{
        acc[cur.id] = cur.count
        return acc
      }, {})


      //палочки
      const stickProduct = prds.find(it => it.type === 'stick' )
      let currentStickCount = stickProduct ? prMap[stickProduct.id] : null
      if(stickProduct && currentStickCount){
        prMap[stickProduct.id] = ((currentStickCount * stickProduct.value) - stickProduct.consumption) / stickProduct.value
        msg += `размешиватель: ${stickProduct.consumption}/${(currentStickCount* stickProduct.value).toFixed()}шт., `
      }

      //сахар
      const sugarProduct = prds.find(it => it.type === 'sugar' )
      let currentSugarCount = sugarProduct ? prMap[sugarProduct.id] : null
      if(sugarProduct && currentSugarCount){
        prMap[sugarProduct.id] = ((currentSugarCount * sugarProduct.value) - sugarProduct.consumption) / sugarProduct.value
        msg += `сахар: ${sugarProduct.consumption}/${(currentSugarCount * sugarProduct.value).toFixed()}пак., `
      }

      //стаканчики
      const cupProduct = prds.find(it => it.type === 'cup' )
      let currentCupCount = cupProduct ? prMap[cupProduct.id] : null
      if(cupProduct && currentCupCount){
        prMap[cupProduct.id] = ((currentCupCount * cupProduct.value) - cupProduct.consumption) / cupProduct.value
        msg += `стаканчик: ${cupProduct.consumption}/${(currentCupCount * cupProduct.value).toFixed()}шт., `
      }

      //крышки
      const capProduct = prds.find(it => it.type === 'cap' )
      let currentCapCount = capProduct ? prMap[capProduct.id] : null
      if(capProduct && currentCapCount){
        prMap[capProduct.id] = ((currentCapCount * capProduct.value) - capProduct.consumption) / capProduct.value
        msg += `крышка: ${cupProduct.consumption}/${(currentCupCount * cupProduct.value).toFixed()}шт., `
      }

      //кофе
      const coffeeProduct = prds.find(it => it.type === 'coffee' )
      let currentCoffeeCount = coffeeProduct ? prMap[coffeeProduct.id] : null
      if(coffeeProduct && currentCoffeeCount){
        prMap[coffeeProduct.id] = ((currentCoffeeCount * coffeeProduct.value) - coffee) / coffeeProduct.value
        msg += `кофе: ${coffee}/${(currentCoffeeCount * coffeeProduct.value).toFixed()}гр., `
      }

      //молоко
      const milkProduct = prds.find(it => it.type === 'milk' )
      let currentMilkCount = milkProduct ? prMap[milkProduct.id] : null
      if(milkProduct && currentMilkCount){
        prMap[milkProduct.id] = ((currentMilkCount * milkProduct.value) - milk) / milkProduct.value
        msg += `Молоко: ${milk}/${(currentMilkCount * milkProduct.value).toFixed()}мл., `
      }

      //сироп
      const syrupProducts = prds.filter(it => it.type === 'syrup' )
      const syrupProduct = syrupProducts[Math.floor(Math.random()*syrupProducts.length)]
      let currentSyrupCount = syrupProduct ? prMap[syrupProduct.id] : null
      if(syrupProduct && currentSyrupCount){
        prMap[syrupProduct.id] = ((currentSyrupCount * syrupProduct.value) - syrupProduct.consumption) / syrupProduct.value
        msg += `${syrupProduct.title}: ${cupProduct.consumption}/${(currentSyrupCount * syrupProduct.value).toFixed()}мл.`
      }

      const productsNow = Object.entries(prMap).reduce((acc, cur)=>{
        acc.push({id: cur[0], count: cur[1]})
        return acc
      }, [])


      await Storage.updateOne({point:id}).set({products:productsNow})

      await KaffitEvent.create({
        type: 'info',
        coffeeMachine,
        owner,
        message: msg
      }).fetch()
    }


    if (up.currentWater <= 2000 || up.currentMilk <= 1000 || up.currentCoffee <= 200) {
      let msg = `${title} - Малый запас ингредиентов:\n<b>Вода:</b> ${(up.currentWater / 1000).toFixed(2)} л.\n<b>Молоко:</b> ${(up.currentMilk / 1000).toFixed(2)} л.\n<b>Кофе:</b> ${(up.currentCoffee / 1000).toFixed(2)} кг.`;
      await Message.createAndSend({point: id, message: msg, type: 'ingredients'});
    }
  },

  async flushing({id}) {
    let {
      currentWater,
      coffeeMachine,
      owner,
      lastFlushing
    } = await CoffeePoint.findOne({id}).select(['currentWater', 'owner', 'coffeeMachine', 'lastFlushing']);

    const last = lastFlushing | 0
    if ((Date.now() - last) > 5 * 60 * 1000) {
      await CoffeePoint.updateOne({id}).set({currentWater: currentWater - 86, lastFlushing: Date.now()})
      await KaffitEvent.create({
        type: 'info',
        coffeeMachine: coffeeMachine,
        owner,
        message: `Промывка кофемашины`
      }).fetch()
    } else {
      await CoffeePoint.updateOne({id}).set({lastFlushing: Date.now()})
    }
  },

  async flushingSystem({point, coffeeMachine, snapshotAt, tz}) {
    let p = await CoffeePoint.findOne({id: point}).select(['currentWater', 'owner']);
    if (!p) return

    let {
      currentWater,
      owner
    } = p;

    const cm = await CoffeeMachine.findOne({id: coffeeMachine}).select(['flushingVolume']);

    await CoffeePoint.updateOne({id: point}).set({
      currentWater: currentWater - cm.flushingVolume,
      lastFlushing: Date.now()
    })
    await KaffitEvent.create({
      type: 'info',
      coffeeMachine: coffeeMachine,
      owner,
      message: `Промывка cистемы кофемашины - ${cm.flushingVolume} мл, локальное время: ${moment(snapshotAt).tz(tz).format("HH:mm:ss DD.MM.YY")}`
    }).fetch()

  },

  async flushingMilk({point, coffeeMachine, snapshotAt, tz}) {
    let {
      currentWater,
      owner,
    } = await CoffeePoint.findOne({id: point}).select(['currentWater', 'owner']);

    const cm = await CoffeeMachine.findOne({id: coffeeMachine}).select(['flushingMilkVolume']);

    await CoffeePoint.updateOne({id: point}).set({
      currentWater: currentWater - cm.flushingMilkVolume,
      lastFlushing: Date.now()
    })
    await KaffitEvent.create({
      type: 'info',
      coffeeMachine: coffeeMachine,
      owner,
      message: `Промывка капучинатора кофемашины - ${cm.flushingMilkVolume} мл, локальное время: ${moment(snapshotAt).tz(tz).format("HH:mm:ss DD.MM.YY")}`
    }).fetch()

  },

  async addIngredients({id, water = 0, milk = 0, coffee = 0}) {
    let {
      currentWater,
      currentMilk,
      currentCoffee
    } = await CoffeePoint.findOne({id}).select(['currentWater', 'currentMilk', 'currentCoffee']);
    await CoffeePoint.updateOne({id}).set({
      currentWater: currentWater + water,
      currentMilk: currentMilk + milk,
      currentCoffee: currentCoffee + coffee
    });
  },

  async findFull({id}) {
    return await CoffeePoint.findOne({id})
      .populate('city')
      .populate('partner')
      .populate('coffeeMachine')
      .then(doc => {
        doc.city = _.pick(doc.city, ['id', 'title']);
        doc.partner = _.pick(doc.partner, ['id', 'title']);
        doc.coffeeMachine = doc.coffeeMachine ? _.pick(doc.coffeeMachine, ['id', 'sin']) : null;
        return doc
      });
  },

  async findFullInit({id}) {
    let point = await CoffeePoint.findOne({id})
      .populate('city')
      .populate('partner')

    // point.profit = await CoffeePoint.dailyProfit({id})
    point.city = _.pick(point.city, ['id', 'title']);
    point.partner = _.pick(point.partner, ['id', 'title']);
    // point.disabledDrinks = point.disabledDrinks.map(it => it.id);
    return point;
  },

  async findTz(id) {
    let tz = 'Europe/Moscow'
    try {
      const point = await CoffeePoint.findOne({id}).select(["city"])
      if (point.city) {
        const city = await City.findOne({id:point.city}).select(["tz"])
        tz = city.tz
      }
    } catch (e) {

    }

    return tz
  },

  afterCreate: async function (newRecord, proceed) {
    CacheService.updatePoint(newRecord)
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    CacheService.updatePoint(updatedRecord)
    return proceed();
  },

  afterDestroy: async function (updatedRecord, proceed) {
    CacheService.removePoint(updatedRecord)
    return proceed();
  },
};
