/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization.split(":")
  const token = auth[0]
  const sn = auth[1]
  const version = auth[2]
  if(req.headers && token === '5dc531c59acf21b50560766731c1b0998f1f0ea4c25baa60098d80c70b5b1e84'){
    const cm = await CoffeeMachine.findOne({sin:sn}).select(['point','partner','owner'])
    const tz = await CoffeePoint.findTz(cm.point)

    if(!cm) return res.forbidden()
    req["sin"] = sn
    req["point"] = cm.point
    req["id"] = cm.id
    req["partner"] = cm.partner
    req["owner"] = cm.owner
    req["tz"] = tz
    next()
  }else{
    return res.forbidden()
  }
};
