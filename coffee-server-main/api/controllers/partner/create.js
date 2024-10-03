module.exports = {

  inputs: {
    title: {
      type: 'string',
      require:true,
      unique: true
    },
    inn: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    owner:{
      type: 'string',
      require:true,
    },
    atolCredentials:{
      type: 'json',
      defaultsTo: {
        kpp:"",
        company: "",
        hostname: "",
        groupCode: "",
        password: "",
        login: "",
      }
    },
    email:{
      type: 'string',
      require:true,
      isEmail: true,
      unique: true
    },
    password: {
      type: 'string',
      require: true
    },
    isEnabledDailyCost: {
      type: 'boolean',
      defaultsTo: false,
    },
    costPerUnit: {
      type: 'number',
      defaultsTo: 500
    },
    cloudKassa: {
      type: 'string',
      isIn:['atol','orangeData'],
      defaultsTo: 'atol'
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


  fn: async function ({title, inn, phone, owner, atolCredentials, email, password, isEnabledDailyCost, costPerUnit, cloudKassa}, exits) {

    try {
      const emails = await Partner.find({email}).select(['email'])
      if (emails.length > 0) {
        throw new Error('Партнер с таким email уже существует')
      }
      let cp = await Partner.create({title, inn, phone, owner, atolCredentials, email, isEnabledDailyCost, costPerUnit, cloudKassa}).fetch()

      await Manager.create({
        name: cp.title,
        phone: cp.phone,
        login: cp.email,
        password: password,
        role: 'admin',
        owner: cp.owner,
        partner: cp.id
      }).fetch()

      let less = await Partner.findFull({id:cp.id})
      exits.success(less)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
