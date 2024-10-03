module.exports = {
  attributes: {
    title: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    costPrice:{
      type: 'number',
    },
    water: {
      type: 'number',
      defaultsTo:50
    },
    volume: {
      type: 'number',
      defaultsTo:200,
    },
    cookingDuration: {
      defaultsTo:30,
      type: 'number',
    },
    isArchive: {
      type: 'boolean',
      defaultsTo: false
    },
    milk: {
      type: 'number',
      defaultsTo:0
    },
    coffee: {
      type: 'number',
      defaultsTo:0
    },
    formula:{
      model:'drinkformula'
    },
    partner: {
      model: 'partner'
    }
  },

  defaultDrinks() {
    return [
      { title: 'Эспрессо', formula: 'sdk_k95_drink_item_01' },
      { title: 'Американо', formula: 'sdk_k95_drink_item_02' },
      { title: 'Горячая вода', formula: 'sdk_k95_drink_item_03' },
      { title: 'Капучино', formula: 'sdk_k95_drink_item_04' },
      { title: 'Латте', formula: 'sdk_k95_drink_item_06' },
      { title: 'Флэт Уайт', formula: 'sdk_k95_drink_item_105' },
      { title: 'Макиато', formula: 'sdk_k95_drink_item_104' },
      { title: 'Кофе со сливками', formula: 'sdk_k95_drink_item_131' },
      { title: 'Двойной эспрессо', formula: 'sdk_k95_drink_item_double_01' },
      { title: 'Двойной капучино', formula: 'sdk_k95_drink_item_double_04' },
      { title: 'Двойной латте', formula: 'sdk_k95_drink_item_double_06' },
      { title: 'Двойной латте макиато', formula: 'sdk_k95_drink_item_double_05' },
      { title: 'Двойной флэт уайт', formula: 'sdk_k95_drink_item_double_105' },
      { title: 'Двойной кофе', formula: 'sdk_k95_drink_item_double_101' },
      { title: 'Двойной ристретто', formula: 'sdk_k95_drink_item_double_111' },
      { title: 'Двойной макиато', formula: 'sdk_k95_drink_item_double_104' },
      { title: 'Двойной кофе со сливками', formula: 'sdk_k95_drink_item_double_131' },
      { title: 'Молоко', formula: 'sdk_k95_drink_item_07' },
      { title: 'Порция молочной пены', formula: 'sdk_k95_drink_item_08' },
      { title: 'Кофе в кофейнике', formula: 'sdk_k95_drink_item_121' }
    ]
  },

  afterCreate: async function (newRecord, proceed) {
    await CacheService.updateDrink(newRecord);
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    await CacheService.updateDrink(updatedRecord);
    return proceed();
  },

}
