
module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
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
    forbidden: {
      responseType: 'forbidden'
    },
  },


  fn: async function ({id}, exits) {
    try {
      if(!this.req.isSuperAdmin && await CoffeeMachine.count({id, owner:this.req.owner}) === 0 ) return exits.forbidden({message:"Нет доступа - недостаточно прав"})
      let man = await CoffeeMachine.findFull({id})
      exits.success(man)
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
};
