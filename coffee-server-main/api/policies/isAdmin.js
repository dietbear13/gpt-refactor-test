/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {

  if (req.isAdmin === true || req.isSuperAdmin === true) next();
  else return res.forbidden({message: "Доступно только админестратору"})
};
