const moment = require('moment');
const crypto = require('crypto').webcrypto;

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function uniqueBy(a, cond) {
  return a.filter((e, i) => a.findIndex(e2 => cond(e, e2)) === i);
}

module.exports = {
  attributes: {
    records: {
      type: 'json'
    },
    point: {
      model: 'coffeepoint'
    },
    snapshotAt: {
      type: 'number'
    },
    profit: {
      type: 'number',
      defaultsTo: 0
    },
    sale: {
      type: 'number',
      defaultsTo: 0
    },
    saleCount: {
      type: 'number',
      defaultsTo: 0
    },
    statDay: {
      type: 'string'
    },
    updatedAt: false,
  },

  findTodayProfit : async function ({point}){
    const tz = await CoffeePoint.findTz(point)
    let statDay = moment().tz(tz).format("DD-MM-YY");
    const stat = await DayStatistic.findOne({
      point: point,
      statDay: statDay
    }).select(["profit"])

    return stat?.profit | 0
  },

  updateStatistic : async function({point, records, snapshotAt}) {

    const tz = await CoffeePoint.findTz(point)
    // records = uniqueBy(records, (o1, o2) => o1.snapshotAt + o1.drink === o2.snapshotAt + o2.drink)
    const idsrecords = records.map(it=>{
      it.id = uuidv4()
      return it
    })

    // console.log("idsrecords", idsrecords)

    let statDay = moment(snapshotAt).tz(tz).format("DD-MM-YY");
    const stat = await DayStatistic.findOne({
      point: point,
      statDay: statDay
    }).select(["records"])
    const recs = []
    if (stat) {
      let arr = [...stat.records, ...idsrecords]
      // arr = uniqueBy(arr, (o1, o2) => o1.snapshotAt + o1.drink === o2.snapshotAt + o2.drink)
      recs.push(...arr)
    } else {
      recs.push(...idsrecords)
    }

    let payDrinks = recs.filter(it => !it.isFree);

    let profit = payDrinks.reduce((acc, cur) => acc + cur.profit, 0)
    let sale = payDrinks.reduce((acc, cur) => acc + cur.amount, 0)
    let saleCount = payDrinks.length

    if (stat) {
      await DayStatistic.updateOne({id: stat.id}).set({records: recs, profit, sale, saleCount})
    } else {
      await DayStatistic.create({
        point,
        records: recs,
        snapshotAt,
        statDay,
        profit,
        sale,
        saleCount
      }).fetch()
    }
  },

  removeDuplicates : async function({point, statDays, ids}){
    const sts = await DayStatistic.find({
      point: point,
      statDay: statDays
    }).select(["records"])

    for (let i = 0; i < sts.length; i++) {
      const st = sts[i]
      const arr = st.records.filter(it => !ids.includes(it.id))
      await DayStatistic.updateOne({id:st.id}).set({records: arr})
    }
  },

  afterCreate: async function (newRecord, proceed) {
    CacheService.updateProfit(newRecord)
    CacheService.updateStatistics(newRecord)
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
    CacheService.updateProfit(updatedRecord)
    CacheService.updateStatistics(updatedRecord)
    return proceed();
  },

  pushRecord: async function ({point, record, owner}){
    const tz = await CoffeePoint.findTz(point)

    if(record.id.includes("api")){
      record.profit = 0
    }


    let statDay = moment(record.snapshotAt).tz(tz).format("DD-MM-YY");

    const stat = await DayStatistic.findOne({point, statDay}).select(['records'])
    let  recs
    if(stat){
      if(stat.records.findIndex(it => it.id === record.id)===-1){
        recs = [...stat.records, record]
      }else{
        recs = [...stat.records]
      }
    }else{
      recs = [record]
    }
    let payDrinks = recs.filter(it => it.profit > 0);

    let profit = payDrinks.reduce((acc, cur) => acc + cur.profit, 0)
    let sale = payDrinks.reduce((acc, cur) => acc + cur.amount, 0)
    let saleCount = payDrinks.length

    if (stat) {
      await DayStatistic.updateOne({id: stat.id}).set({records: recs, profit, sale, saleCount})
    } else {
      await DayStatistic.create({
        point,
        records: recs,
        snapshotAt:record.snapshotAt,
        statDay,
        profit,
        sale,
        saleCount,
        owner
      }).fetch()
    }
  }
}
