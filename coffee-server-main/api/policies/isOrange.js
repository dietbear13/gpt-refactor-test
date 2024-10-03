/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = async function (req, res, next) {
  const token = req.headers.authorization
  if(req.headers && token === '7f21b5056076670b5b1e80c59ac31c1b0998f1fea4c25baa60098d80c45dc531'){
    next()
  }else{
    return res.forbidden()
  }
};
