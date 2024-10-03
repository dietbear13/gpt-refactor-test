module.exports = {
  friendlyName: 'refresh',

  inputs: {
    refreshToken: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Returns ok response from api/responses/ok.js //status 200',
      responseType: 'ok'
    },
    badRequest: {
      responseType: 'badRequest'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },


  fn: async function ({refreshToken}, exits) {

    try{
      let token =""
      let parts = refreshToken.split(' ');
      if (parts.length === 2) {
        let scheme = parts[0],
          credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return exits.forbidden({message: 'Format is Authorization: Bearer [token]'});
      }


      let userId = await jwToken.verifyRefresh(token, function (err, enToken) {
        if (err) return exits.forbidden({message: 'Invalid refresh token'});
        return enToken.id; // This is the decrypted token or the payload you provided
      });

      if(!userId) return exits.forbidden({message: "Invalid refresh token"})

      let user = await Manager.findOne({id:userId})

      let accessToken = jwToken.issueManager({id: user.id, role:user.role, owner:user.owner, partner:user.partner})
      let newRefreshToken = jwToken.issueRefresh({id: userId})
      this.req.session.token = accessToken;
      this.req.session.refreshToken = newRefreshToken;
      return exits.success({token:accessToken, refreshToken:newRefreshToken})

    }catch (err){
      exits.forbidden({message: "Invalid refresh token"})
    }
  }
};
