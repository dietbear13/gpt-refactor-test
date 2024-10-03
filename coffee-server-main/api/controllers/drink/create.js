module.exports = {

  inputs: {
    title: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    costPrice: {
      type: 'number',
      required: true
    },
    volume: {
      type: 'number',
      required: true
    },
    water: {
      type: 'number',
      required: true
    },
    milk: {
      type: 'number',
      required: true
    },
    coffee: {
      type: 'number',
      required: true
    },
    partner: {
      type: 'string',
      required: true
    },
    formula: {
      type: 'string',
      allowNull: true
    }
  },


  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
  },


  fn: async function ({title,price,water,milk,coffee,costPrice,volume,partner,formula}, exits) {
    try {
      let {owner} = await Partner.findOne({id: partner}).select(["owner"]);
      let drinkFormula = {};
      const defaultFormulas = DrinkFormula.defaultFormulas();
      for (let key in defaultFormulas) {
        if (defaultFormulas[key].sdk === formula) {
          drinkFormula = defaultFormulas[key]
        }
      };
      let {id} = await DrinkFormula.create(drinkFormula).fetch();
      let know = await Drink.create({title,price,water,milk,coffee,costPrice,volume,partner,owner,formula: id}).fetch();
      await DrinkFormula.updateOne({id}, {drink: know.id});
      exits.success(know);
    } catch (err) {
      sails.log.error(err);
      throw {serverError: {message: err.message}};
    }
  }
};

