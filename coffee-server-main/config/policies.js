/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  'AuthController': {
    '*': true
  },

  'AdminController': {
    '*': 'isManager'
  },

  'CityController': {
    '*': 'isManager',
    'create': ['isManager', 'isSuperAdmin'],
    'update': ['isManager', 'isSuperAdmin'],
    'delete': ['isManager', 'isSuperAdmin']
  },

  'CoffeemachineController': {
    '*': 'isManager',
    'create': ['isManager', 'isAdmin'],
    'obtain-cm-link': ['isManager', 'isSuperAdmin']
  },

  'PointController': {
    '*': 'isManager',
    'create': ['isManager', 'isAdmin'],
    'update': ['isManager', 'isAdmin'],
    'delete': ['isManager', 'isSuperAdmin']
  },

  'PartnerController': {
    '*': ['isManager', 'isSuperAdmin'],
    'read': ['isManager', 'isAdmin'],
    'update': ['isManager', 'isAdmin'],
    // 'upload-keys': ['isManager', 'isSuperAdmin'],
    'short': 'isManager',
    'dashboard/*': 'isManager',
    'balance/transactions': ['isManager', 'isAdmin']
  },

  'DrinkController': {
    '*': ['isManager', 'isAdmin']
  },

  'KalermController': {
    '*': ['isKalerm']
  }
}
