/* eslint-disable linebreak-style */
const debug = process.env.NODE_ENV !== 'production' || process.env.IS_STAGER;
const moment = require('moment');

module.exports.cron = {

  // // отчеты каждую неделю
  // weeklyDocs: {
  //   schedule: '0 0 8 * * 1',
  //   timezone: 'Europe/Moscow',
  //   onTick: async function () {
  //     if (!debug) {
  //       await DocService.weekReports()
  //     }
  //   },
  // },

  // // отчеты каждый месяц
  // monthDocs: {
  //   schedule: '0 0 8 1 * *',
  //   timezone: 'Europe/Moscow',
  //   onTick: async function () {
  //     if (!debug) {
  //       await DocService.monthReports()
  //     }
  //   },
  // },

  // списание за обслуживание в 00:15MSK
  dailyCost: {
    schedule: '00 15 00 * * *',
    onTick: async function () {
      if (!debug) {
        sails.log.warn('dailyCost');
        const partners = (await Partner.find({isEnabledDailyCost: true}).select(["id"])).map(it => it.id)
        for (let i = 0; i < partners.length; i++) {
          const partner = partners[i]
          try {
            await Partner.downBalanceDaily({id: partner})
          } catch (e) {
            sails.log.error("err dailyCost", e)
          }
        }
      }
    },
    timezone: 'Europe/Moscow',
    // runOnInit: true,
  },

  fetchAtolTokens: {
    schedule: '00 20 */12 * * *',
    onTick: async function () {
      if (!debug) {
        sails.log.warn('update partner tokens');
        await AtolService.fetchTokens();
      }
    },
  }
};

