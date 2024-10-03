/* eslint-disable linebreak-style */
module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest',
    },
    serverError: {
      responseType: 'serverError',
    },
    forbidden: {
      responseType: 'forbidden',
    },
  },

  fn: async function ({ id }, exits) {
    try {
      if (
        !this.req.isSuperAdmin &&
        (await CoffeePoint.count({ id, owner: this.req.owner })) === 0
      ) {
        return exits.forbidden({ message: 'Нет доступа - недостаточно прав' })
      }
      let point = await CoffeePoint.findFull({ id })
      exits.success(point)
    } catch (err) {
      sails.log.error(err)
      exits.serverError(err)
    }
  },
}
