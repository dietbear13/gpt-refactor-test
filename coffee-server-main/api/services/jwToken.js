/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

const jwt = require('jsonwebtoken');
const tokenSecret = "91096da36d6cfd543f4a333baeb0044c";
const tokenSecretManager = "d543f4a333baeb091096da36d6cf044c";
const tokenSecretRefresh = "9109d56dcf044ca36dbaeb043f4a3336";
module.exports = {
  verify: function (token, callback) {
    return jwt.verify(
      token, // The token to be verified
      tokenSecret, // Same token we used to sign
      {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      callback //Pass errors or decoded token to callback
    );
  },


  issue: function (payload) {
    return jwt.sign(
      payload,
      tokenSecret, // Token Secret that we sign it with
      {
        expiresIn: "18250d" // Token Expire time 50 * 365d
        // expiresIn: "30s" // Token Expire time 7 * 24h
      }
    );
  },

  issueManager: function (payload) {
    return jwt.sign(
      payload,
      tokenSecretManager, // Token Secret that we sign it with
      {
        expiresIn: "7d" // Token Expire time 7 * 24h
        // expiresIn: "30s" // Token Expire time 7 * 24h
      }
    );
  },

  verifyManager: function (token, callback) {
    return jwt.verify(
      token, // The token to be verified
      tokenSecretManager, // Same token we used to sign
      {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      callback //Pass errors or decoded token to callback
    );
  },

  verifyRefresh: function (token, callback) {
    return jwt.verify(
      token, // The token to be verified
      tokenSecretRefresh, // Same token we used to sign
      {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      callback //Pass errors or decoded token to callback
    );
  },

  issueRefresh : function (payload) {
    return jwt.sign(
      payload,
      tokenSecretRefresh, // Token Secret that we sign it with
      {
        expiresIn: "30d" // Token Expire time 4 week
      }
    );
  },
}
