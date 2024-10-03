module.exports = {
  attributes: {
    sin: {
      type: 'string',
      allowNull: true
    },
    version: {
      type: 'string',
      allowNull: true
    },
    partner: {
      model: 'partner',
    },
    point: {
      model: 'coffeepoint',
      // via:'coffeeMachine'
    },
    disabledDrinks: {
      type: 'json',
      defaultsTo: []
    },
    status: {
      type: 'string',
      defaultsTo: 'not-defined'
    },
    drink1: {
      model: 'drink'
    },
    isEnabledDrink1: {
      type: 'boolean',
      defaultsTo: true
    },
    drink2: {
      model: 'drink'
    },
    isEnabledDrink2: {
      type: 'boolean',
      defaultsTo: true
    },
    drink3: {
      model: 'drink'
    },
    isEnabledDrink3: {
      type: 'boolean',
      defaultsTo: true
    },
    drink4: {
      model: 'drink'
    },
    isEnabledDrink4: {
      type: 'boolean',
      defaultsTo: true
    },
    drink5: {
      model: 'drink'
    },
    isEnabledDrink5: {
      type: 'boolean',
      defaultsTo: true
    },
    drink6: {
      model: 'drink'
    },
    isEnabledDrink6: {
      type: 'boolean',
      defaultsTo: true
    },
    drink7: {
      model: 'drink'
    },
    isEnabledDrink7: {
      type: 'boolean',
      defaultsTo: true
    },
    drink8: {
      model: 'drink'
    },
    isEnabledDrink8: {
      type: 'boolean',
      defaultsTo: true
    },
    drink9: {
      model: 'drink'
    },
    isEnabledDrink9: {
      type: 'boolean',
      defaultsTo: true
    },
    drink10: {
      model: 'drink'
    },
    isEnabledDrink10: {
      type: 'boolean',
      defaultsTo: true
    },
    drink11: {
      model: 'drink'
    },
    isEnabledDrink11: {
      type: 'boolean',
      defaultsTo: true
    },
    drink12: {
      model: 'drink'
    },
    isEnabledDrink12: {
      type: 'boolean',
      defaultsTo: true
    },
    drink13: {
      model: 'drink'
    },
    isEnabledDrink13: {
      type: 'boolean',
      defaultsTo: true
    },
    drink14: {
      model: 'drink'
    },
    isEnabledDrink14: {
      type: 'boolean',
      defaultsTo: true
    },
    drink15: {
      model: 'drink'
    },
    isEnabledDrink15: {
      type: 'boolean',
      defaultsTo: true
    },
    drink16: {
      model: 'drink'
    },
    isEnabledDrink16: {
      type: 'boolean',
      defaultsTo: true
    },
    drink17: {
      model: 'drink'
    },
    isEnabledDrink17: {
      type: 'boolean',
      defaultsTo: true
    },
    drink18: {
      model: 'drink'
    },
    isEnabledDrink18: {
      type: 'boolean',
      defaultsTo: true
    },
    drink19: {
      model: 'drink'
    },
    isEnabledDrink19: {
      type: 'boolean',
      defaultsTo: true
    },
    drink20: {
      model: 'drink'
    },
    isEnabledDrink20: {
      type: 'boolean',
      defaultsTo: true
    },
    drink21: {
      model: 'drink'
    },
    isEnabledDrink21: {
      type: 'boolean',
      defaultsTo: true
    },
    drink22: {
      model: 'drink'
    },
    isEnabledDrink22: {
      type: 'boolean',
      defaultsTo: true
    },
    drink23: {
      model: 'drink'
    },
    isEnabledDrink23: {
      type: 'boolean',
      defaultsTo: true
    },
    drink24: {
      model: 'drink'
    },
    isEnabledDrink24: {
      type: 'boolean',
      defaultsTo: true
    },
    counters: {
      type: 'json',
      defaultsTo: {}
    },
    flushingVolume: {
      type: 'number',
      defaultsTo: 130
    },
    flushingMilkVolume: {
      type: 'number',
      defaultsTo: 60
    },
    isPinpad: {
      type: 'boolean',
      defaultsTo: true
    },
    cloudKassa: {
      type: 'string',
      isIn: ['atol', 'orangeData'],
      defaultsTo: 'atol'
    }
  },

  afterCreate: async function (newRecord, proceed) {
    CacheService.updateCoffeeMachine(newRecord);
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    CacheService.updateCoffeeMachine(updatedRecord);
    return proceed();
  },

  afterDestroy: async function (updatedRecord, proceed) {
    CacheService.removeCoffeeMachine(updatedRecord);
    return proceed();
  },

  async incrementCounters({id, records}) {
    if (records.length === 0) {
      return;
    }
    const cp = await CoffeeMachine.findOne({id}).select(['counters']);
    let newCounters = cp.counters ? cp.counters : {};
    const counters = records.reduce((acc, cur) => {
      if (acc[cur.drink]) {
        acc[cur.drink] = acc[cur.drink] + 1;
      } else {
        acc[cur.drink] = 1;
      }
      return acc;
    }, newCounters);
    await CoffeeMachine.updateOne({id}).set({counters});

  },

  async lastPendingRecommendation({coffeeMachine, recommendation}) {
    return (await PendingRecommendation.find({coffeeMachine, recommendation}).sort('createdAt DESC').limit(1))[0];
  },

  async checkNeedRecommendation({id}) {


    const {partner, counters} = await CoffeeMachine.findOne({id}).select(['partner', 'counters']);
    let dr = await Drink.find().select(['milk']);
    const drinksHasMilk = dr.reduce((acc, cur) => {
      acc[cur.id] = cur.milk > 0;
      return acc;
    }, {});
    const recomm = await Recommendation.find().select(['id', 'condition']);

    console.log("checkNeedRecommendation  ", id, partner, recomm.length, dr.length)
    for (let i = 0; i < recomm.length; i++) {
      const rec = recomm[i]
      const last = await CoffeeMachine.lastPendingRecommendation({coffeeMachine: id, recommendation: rec.id});

      const lastCounters = last ? last.counters : Object.keys(counters).reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {});

      if (rec.condition.milk) {
        const milk = Object.keys(counters).filter(it => drinksHasMilk[it] === true).map(it => counters[it]).reduce((acc, cur) => acc + cur, 0) - Object.keys(lastCounters).filter(it => drinksHasMilk[it] === true).map(it => lastCounters[it]).reduce((acc, cur) => acc + cur, 0);
        if (milk > rec.condition.total) {
          console.log("need create milk", rec.condition)
          await PendingRecommendation.createIfNotExist({recommendation: rec.id, coffeeMachine: id, partner})
        }
      } else {
        const total = Object.values(counters).reduce((acc, cur) => acc + cur, 0) - Object.values(lastCounters).reduce((acc, cur) => acc + cur, 0);
        if (total > rec.condition.total) {
          console.log("need create total", rec.condition)
          await PendingRecommendation.createIfNotExist({recommendation: rec.id, coffeeMachine: id, partner})
        }
      }
    }

    // BotService.sendRecommendationNotification({partner});

  },

  async findDrinks({id}) {
    const coffeeMachine = await CoffeeMachine.findOne({id})
      .populate('drink1')
      .populate('drink2')
      .populate('drink3')
      .populate('drink4')
      .populate('drink5')
      .populate('drink6')
      .populate('drink7')
      .populate('drink8')
      .populate('drink9')
      .populate('drink10')
      .populate('drink11')
      .populate('drink12')
      .populate('drink13')
      .populate('drink14')
      .populate('drink15')
      .populate('drink16')
      .populate('drink17')
      .populate('drink18')
      .populate('drink19')
      .populate('drink20')
      .populate('drink21')
      .populate('drink22')
      .populate('drink23')
      .populate('drink24');

    const drinks = [];

    if (coffeeMachine.isEnabledDrink1) {
      drinks.push(coffeeMachine.drink1);
    }
    if (coffeeMachine.isEnabledDrink2) {
      drinks.push(coffeeMachine.drink2);
    }
    if (coffeeMachine.isEnabledDrink3) {
      drinks.push(coffeeMachine.drink3);
    }
    if (coffeeMachine.isEnabledDrink4) {
      drinks.push(coffeeMachine.drink4);
    }
    if (coffeeMachine.isEnabledDrink5) {
      drinks.push(coffeeMachine.drink5);
    }
    if (coffeeMachine.isEnabledDrink6) {
      drinks.push(coffeeMachine.drink6);
    }
    if (coffeeMachine.isEnabledDrink7) {
      drinks.push(coffeeMachine.drink7);
    }
    if (coffeeMachine.isEnabledDrink8) {
      drinks.push(coffeeMachine.drink8);
    }
    if (coffeeMachine.isEnabledDrink9) {
      drinks.push(coffeeMachine.drink9);
    }
    if (coffeeMachine.isEnabledDrink10) {
      drinks.push(coffeeMachine.drink10);
    }
    if (coffeeMachine.isEnabledDrink11) {
      drinks.push(coffeeMachine.drink11);
    }
    if (coffeeMachine.isEnabledDrink12) {
      drinks.push(coffeeMachine.drink12);
    }
    if (coffeeMachine.isEnabledDrink13) {
      drinks.push(coffeeMachine.drink13);
    }
    if (coffeeMachine.isEnabledDrink14) {
      drinks.push(coffeeMachine.drink14);
    }
    if (coffeeMachine.isEnabledDrink15) {
      drinks.push(coffeeMachine.drink15);
    }
    if (coffeeMachine.isEnabledDrink16) {
      drinks.push(coffeeMachine.drink16);
    }
    if (coffeeMachine.isEnabledDrink17) {
      drinks.push(coffeeMachine.drink17);
    }
    if (coffeeMachine.isEnabledDrink18) {
      drinks.push(coffeeMachine.drink18);
    }
    if (coffeeMachine.isEnabledDrink19) {
      drinks.push(coffeeMachine.drink19);
    }
    if (coffeeMachine.isEnabledDrink20) {
      drinks.push(coffeeMachine.drink20);
    }
    if (coffeeMachine.isEnabledDrink21) {
      drinks.push(coffeeMachine.drink21);
    }
    if (coffeeMachine.isEnabledDrink22) {
      drinks.push(coffeeMachine.drink22);
    }
    if (coffeeMachine.isEnabledDrink23) {
      drinks.push(coffeeMachine.drink23);
    }
    if (coffeeMachine.isEnabledDrink24) {
      drinks.push(coffeeMachine.drink24);
    }
    return drinks;
  },

  async findAllDrinks({id}) {
    const coffeeMachine = await CoffeeMachine.findOne({id})
      .populate('drink1')
      .populate('drink2')
      .populate('drink3')
      .populate('drink4')
      .populate('drink5')
      .populate('drink6')
      .populate('drink7')
      .populate('drink8');

    const drinks = [];

    drinks.push(coffeeMachine.drink1);
    drinks.push(coffeeMachine.drink2);
    drinks.push(coffeeMachine.drink3);
    drinks.push(coffeeMachine.drink4);
    drinks.push(coffeeMachine.drink5);
    drinks.push(coffeeMachine.drink6);
    drinks.push(coffeeMachine.drink7);
    drinks.push(coffeeMachine.drink8);

    return drinks;
  },

  async findFull({id}) {
    const cm = await CoffeeMachine.findOne({id})
      .populate('point')
      .populate('partner')
      .then(doc => {
        doc.sin = doc.sin ?? doc.controllerId
        doc.point = doc.point ? _.pick(doc.point, ['id', 'title']) : null;
        doc.partner = _.pick(doc.partner, ['id', 'title']);
        return doc;
      });

    if (cm.drink1 == null || cm.drink2 == null || cm.drink3 == null || cm.drink4 == null ||
      cm.drink5 == null || cm.drink6 == null || cm.drink7 == null || cm.drink8 == null ||
      cm.drink9 == null || cm.drink10 == null || cm.drink11 == null || cm.drink12 == null ||
      cm.drink13 == null || cm.drink14 == null || cm.drink15 == null || cm.drink16 == null ||
      cm.drink17 == null || cm.drink18 == null || cm.drink19 == null || cm.drink20 == null ||
      cm.drink21 == null || cm.drink22 == null || cm.drink23 == null || cm.drink24 == null
    ) {
      cm.formulas = []
      return cm
    }

    cm.status = await CacheService.getStatusBySin(cm.sin)

    let drinks = await Promise.all([
      Drink.findOne({id: cm.drink1}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink2}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink3}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink4}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink5}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink6}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink7}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink8}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink9}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink10}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink11}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink12}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink13}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink14}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink15}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink16}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink17}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink18}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink19}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink20}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink21}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink22}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink23}).select(["id", "milk"]).populate("formula"),
      Drink.findOne({id: cm.drink24}).select(["id", "milk"]).populate("formula")
    ]);

    let formulas = drinks
      .map(it => {
        it.formula.drink = it.id
        return it.formula
      })



    const customFormulas = await Promise.all([
      DrinkFormula.findOne({drink: cm.drink1, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink2, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink3, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink4, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink5, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink6, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink7, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink8, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink9, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink10, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink11, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink12, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink13, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink14, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink15, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink16, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink17, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink18, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink19, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink20, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink21, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink22, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink23, coffeeMachine: cm.id}),
      DrinkFormula.findOne({drink: cm.drink24, coffeeMachine: cm.id})
    ])

    formulas = formulas.map((it, ind) => {
      if (customFormulas[ind]) {
        return customFormulas[ind]
      } else {
        return it
      }
    })

    cm.formulas = formulas
    cm.isEnabledMilk = true
    for (let i = 0; i < 8; i++) {
      if (drinks[i].milk > 0 && !cm['isEnabledDrink' + (i + 1)]) {
        cm.isEnabledMilk = false
        break
      }
    }


    return cm
  },

  async findKalermDrinks({id}) {
    const coffeeMachine = await CoffeeMachine.findOne({id})

    const customFormulas = await Promise.all([
      DrinkFormula.findOne({drink: coffeeMachine.drink1, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink2, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink3, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink4, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink5, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink6, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink7, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink8, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink9, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink10, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink11, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink12, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink13, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink14, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink15, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink16, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink17, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink18, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink19, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink20, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink21, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink22, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink23, coffeeMachine: coffeeMachine.id}),
      DrinkFormula.findOne({drink: coffeeMachine.drink24, coffeeMachine: coffeeMachine.id})
    ])

    const drinks = (await Promise.all([
      Drink.findOne({id: coffeeMachine.drink1}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink2}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink3}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink4}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink5}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink6}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink7}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink8}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink9}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink10}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink11}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink12}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink13}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink14}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink15}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink16}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink17}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink18}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink19}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink20}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink21}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink22}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink23}).populate("formula"),
      Drink.findOne({id: coffeeMachine.drink24}).populate("formula")
    ]))
      .map((it, ind) => {
        if (it == null) return null
        const key = `isEnabledDrink${ind + 1}`
        it.lock = !coffeeMachine[key] ?? false
        it.position = ind + 1
        if (customFormulas[ind]) {
          it.formula = customFormulas[ind]
        }
        return it
      })
      .filter(it => it != null)

    return {currency: "RUB", drinks}
  },

  async milkStatus({id}) {

    const cm = await CoffeeMachine.findOne({id})
      .populate('drink1')
      .populate('drink2')
      .populate('drink3')
      .populate('drink4')
      .populate('drink5')
      .populate('drink6')
      .populate('drink7')
      .populate('drink8')
      .populate('drink9')
      .populate('drink10')
      .populate('drink11')
      .populate('drink12')
      .populate('drink13')
      .populate('drink14')
      .populate('drink15')
      .populate('drink16')
      .populate('drink17')
      .populate('drink18')
      .populate('drink19')
      .populate('drink20')
      .populate('drink21')
      .populate('drink22')
      .populate('drink23')
      .populate('drink24')


    for (let i = 1; i < 9; i++) {
      if(cm['drink' + i] == null) continue
      if (cm['drink' + i].milk  > 0 && cm['isEnabledDrink' + i]) return true
    }

    return false
  },

  async enableMilk({id, isEnabled}) {
    let cm = await CoffeeMachine.findOne({id})
      .populate('drink1')
      .populate('drink2')
      .populate('drink3')
      .populate('drink4')
      .populate('drink5')
      .populate('drink6')
      .populate('drink7')
      .populate('drink8')
      .populate('drink9')
      .populate('drink10')
      .populate('drink11')
      .populate('drink12')
      .populate('drink13')
      .populate('drink14')
      .populate('drink15')
      .populate('drink16')
      .populate('drink17')
      .populate('drink18')
      .populate('drink19')
      .populate('drink20')
      .populate('drink21')
      .populate('drink22')
      .populate('drink23')
      .populate('drink24')

    const updateSet = {}
    const oldSet = {}

    for (let i = 1; i < 9; i++) {
      if(cm['drink' + i] == null) continue
      if (cm['drink' + i].milk > 0) {
        oldSet['isEnabledDrink' + i] = cm['isEnabledDrink' + i]
        updateSet['isEnabledDrink' + i] = isEnabled
      }
    }


    await CoffeeMachine.updateOne({id}).set(updateSet)
    try {
      await RedisService.updateDrinks({id})
      return isEnabled
    } catch (e) {
      await CoffeeMachine.updateOne({id}).set(oldSet)
      return !isEnabled
    }
  },

};

