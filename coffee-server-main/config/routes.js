/* eslint-disable linebreak-style */
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  'POST /api/v1/manager/login': 'AuthController.manager-login',
  'POST /api/v1/manager/logout': 'AdminController.manager-logout',
  'GET /api/v1/manager/profile': 'AdminController.manager-read',

  'GET /api/v1/admin/cities': 'CityController.list',
  'GET /api/v1/admin/city/:id': 'CityController.read',
  'PUT /api/v1/admin/city/:id': 'CityController.update',
  'POST /api/v1/admin/city': 'CityController.create',
  'DELETE /api/v1/admin/city/:id': 'CityController.delete',
  'GET /api/v1/admin/city/:id/points': 'CityController.points',

  'POST /api/v1/admin/points/:id/removeDuplicates': 'PointController.remove-duplicates',
  'GET /api/v1/admin/points/:id/dashboard/sales': 'PointController.dashboard.sales',
  'GET /api/v1/admin/points/:id/dashboard/report': 'PointController.dashboard.report',
  'GET /api/v1/admin/points/:id/dashboard/sales-period': 'PointController.dashboard.sales-period',
  'GET /api/v1/admin/points/:id/dashboard/traffic': 'PointController.dashboard.traffic',

  'POST /api/v1/admin/point': 'PointController.create',
  'PUT /api/v1/admin/point/:id': 'PointController.update',
  'GET /api/v1/admin/points': 'PointController.list',
  'PUT /api/v1/admin/point/:id/volumes': 'PointController.correct-volumes',

  'GET /api/v1/admin/points/:id': 'PointController.read',

  'GET /api/v1/admin/points/:id/widgets/statistics': 'PointController.widgets.statistics',
  'GET /api/v1/admin/points/:id/widgets/cashbacks': 'PointController.widgets.cashbacks',
  'DELETE /api/v1/admin/point/:id': 'PointController.delete',

  'GET /api/v1/admin/partners': 'PartnerController.list',
  'GET /api/v1/admin/partners/:id': 'PartnerController.read',
  'PUT /api/v1/admin/partners/:id': 'PartnerController.update',
  'POST /api/v1/admin/partners/:id/upload-keys': 'PartnerController.upload-keys',
  'POST /api/v1/admin/partners': 'PartnerController.create',
  'DELETE /api/v1/admin/partners/:id': 'PartnerController.delete',
  'POST /api/v1/admin/partners/reports/week': 'PartnerController.create-week-report',
  'POST /api/v1/admin/partners/reports/month': 'PartnerController.create-month-report',
  'POST /api/v1/admin/partners/reports/interval': 'PartnerController.create-interval-report',
  'POST /api/v1/admin/partners/:id/upload': 'PartnerController.upload-keys',

  'GET /api/v1/admin/partners/:id/dashboard/sales': 'PartnerController.dashboard.sales',
  'GET /api/v1/admin/partners/:id/dashboard/report': 'PartnerController.dashboard.report',
  'GET /api/v1/admin/partners/:id/dashboard/report-points': 'PartnerController.dashboard.report-points',
  'GET /api/v1/admin/partners/:id/dashboard/sales-period': 'PartnerController.dashboard.sales-period',
  'GET /api/v1/admin/partners/:id/dashboard/statuses': 'PartnerController.dashboard.statuses',
  'GET /api/v1/admin/partners/:id/dashboard/traffic': 'PartnerController.dashboard.traffic',

  'GET /api/v1/admin/partners/:id/balance/transactions': 'PartnerController.balance.transactions',
  'POST /api/v1/admin/partners/:id/balance/payment': 'PartnerController.balance.payment',

  'GET /api/v1/admin/drinks': 'DrinkController.list',
  'PUT /api/v1/admin/drink/:id': 'DrinkController.update',
  'POST /api/v1/admin/drink': 'DrinkController.create',
  'GET /api/v1/admin/drink/:id': 'DrinkController.read',
  'GET /api/v1/admin/drink/:id/formula': 'DrinkController.formula',
  'PUT /api/v1/admin/drink/formula/:id': 'DrinkController.formula-update',

  'GET /api/v1/admin/partners/dictionary': 'PartnerController.short',
  'GET /api/v1/admin/drinks/dictionary': 'DrinkController.short',
  'GET /api/v1/admin/points/dictionary': 'PointController.short',
  'GET /api/v1/admin/cities/dictionary': 'CityController.short',
  'GET /api/v1/admin/coffeemachines/dictionary': 'CoffeemachineController.short',
  'GET /api/v1/admin/tz/dictionary': 'CityController.tz',

  // kalerm
  'GET /api/v2/kalerm/work-profile': 'KalermController.work-profile',
  'GET /api/v2/kalerm/drinks': 'KalermController.drinks',
  'POST /api/v2/kalerm/drink-cooked': 'KalermController.drink-cooked',
  'POST /api/v2/kalerm/save-formula': 'KalermController.save-formula',
  'POST /api/v2/kalerm/flushing': 'KalermController.flushing',
  'POST /api/v2/kalerm/milk-flushing': 'KalermController.flushing-milk',
  'POST /api/v2/kalerm/purchase': 'KalermController.purchase-create',
  'GET /api/v2/kalerm/purchase/:id': 'KalermController.purchase-find',
  'POST /api/v2/kalerm/status': 'KalermController.status-update',
  'POST /api/v2/kalerm/errors': 'KalermController.errors',
  'POST /api/v2/kalerm/version': 'KalermController.version-update',
  'GET /api/v2/kalerm/app/update': 'KalermController.launcher-url',
  'POST /api/v2/kalerm/counters': 'KalermController.counters',
  'POST /api/v2/kalerm/reconciliation': 'KalermController.reconciliation-status',

  //coffeemachines
  'GET /api/v1/admin/coffeemachines/:id': 'CoffeemachineController.read',
  'GET /api/v1/admin/coffeemachines/:id/kaffit-logs': 'CoffeemachineController.kaffit-logs',
  'PUT /api/v1/admin/coffeemachines/:id/kaffit-logs': 'CoffeemachineController.kaffit-logs-apply',
  'GET /api/v1/admin/coffeemachines': 'CoffeemachineController.list',
  'POST /api/v1/admin/coffeemachines': 'CoffeemachineController.create',
  'PUT /api/v1/admin/coffeemachines': 'CoffeemachineController.update',
  'DELETE /api/v1/admin/coffeemachines/:id': 'CoffeemachineController.delete',
  'GET /api/v1/admin/coffeemachines/:id/drinks': 'CoffeemachineController.drinks',
  'PUT /api/v1/admin/coffeemachines/:coffeeMachine/drinks/:drink/formula': 'CoffeemachineController.save-formula',
  'POST /api/v1/admin/coffeemachines/:id/actions/enablePinpad': 'CoffeemachineController.enable-pinpad',
  'POST /api/v1/admin/coffeemachines/:id/actions/updateDrinks': 'CoffeemachineController.update-drinks',
  'POST /api/v1/admin/coffeemachines/:id/actions/updateStatus': 'CoffeemachineController.update-status',
  'POST /api/v1/admin/coffeemachines/:id/actions/updateVersion': 'CoffeemachineController.update-version',
  'POST /api/v1/admin/coffeemachines/:id/actions/updateApp': 'CoffeemachineController.update-app',
  'POST /api/v1/admin/coffeeMachine/:id/milk/enable': 'CoffeemachineController.milk-enable',

  //atol
  'POST /api/v2/atol/receipt/:id' : 'AtolController.receipt',
  'GET /api/v2/atol/receipt/:id' : 'AtolController.receipt',

  //orange
  'POST /api/v2/orange/receipt/:purchaseId' : 'OrangeController.receipt',

  'POST /api/v1/test2' : 'AuthController.test',
};
