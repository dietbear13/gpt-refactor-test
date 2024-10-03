/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      let scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.status(403).json({err: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.status(403).json({err: 'No Authorization header was found'});
  }

  jwToken.verifyManager(token, function (err, enToken) {
    if (err && err.name === "TokenExpiredError") return res.status(401).json({message: 'Token Expired'});
    else if (err) return res.status(403).json({message: 'Invalid Token!'});


    req.isSuperAdmin = enToken.role === "superadmin"
    req.isAdmin = enToken.role === "admin"
    req.userId = enToken.id;
    req.role = enToken.role;
    req.owner = enToken.owner;
    req.partner = enToken.partner;
    next();
  });
};
