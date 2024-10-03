
module.exports = {
  inputs: {
    login: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },


  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },


  fn: async function ({login, password}, exits) {
    let user = await Manager.findOne({login: login}).decrypt();

    if (user && user.password === password) {
      let token = jwToken.issueManager({id: user.id, role:user.role, owner:user.owner, partner:user.partner});

      let refreshToken = jwToken.issueRefresh({id: user.id});

      this.req.session.token = token;
      this.req.session.refreshToken = refreshToken;

      user.points =( await CoffeePoint.find({partner:user.partner}).select(['id'])).map(it => it.id);

      return exits.success({
        user: user,
        token: token,
        refreshToken: refreshToken,
      });
    } else {
      throw {badRequest: {message: 'Неверный логин или пароль'}};
    }
  },


};
