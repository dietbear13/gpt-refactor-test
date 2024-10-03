const moment = require('moment');
const debug = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'HNAsBCXtg5ts4NFDsAtFs8YXZfKOTYeBmrFWqpFcTOnsHSRX14MN3eDat0AuVL5nDmDqQFLCs0sT09iLQpddsTpTueXtAmstmsTVTIYXE5ZBYoedYZQ8tiJWsXfPA64JGuXtXCJKDAT45FGNeqpi4dJssBQAPHDPAt2TosCDfDZHtPsTQE59XDuime5toQDFR3pBIBtE0ricL3dcdGiSoSfmWBcniNeBieCmcBBqJTGuOZoioPGsBb5MpPseQuOG';
const REDIS_USER = process.env.REDIS_USER || 'redis';

const redis = require('redis');

let client

let coffeeMachines = {};
let coffeeMachinesUpdatedAt = 0;
let partners = {};
let partnersUpdatedAt = 0;
let cities = {};
let points = {};
let pointsUpdatedAt = 0;
let profits = {};
let logs = {};
let users = {};
let usersUpdatedAt = 0;
let statistics = {}
let permissions = {}
let managerPoints = {}

const init = async () => {
  console.log(`REDIS_USER ${REDIS_USER}:${REDIS_PASSWORD}`)
  client = await redis.createClient({
    url: !debug ? `redis://:${REDIS_PASSWORD}@cache:${REDIS_PORT}` : `redis://:${REDIS_PASSWORD}@crm.ooofortytwo.ru/:${REDIS_PORT}`,
  })

  client.on('disconnect', () => sails.log.warn('Redis Client disconnect'))
  client.on('ready', () => fetchRedisCache())
  client.on('error', (err) => sails.log.error('Redis Client Error', err))


  await client.connect();
  setInterval( async () => {await client.ping()}, 60000)
}

//redis
const fetchManagers = async () => {
  const managers = await Manager.find({telegramId: {"!=": null}})
    .select(["telegramId", "permissions"])
    .populate("points", {
      where: {
        isArchive: false,
        coffeeMachine: {"!=": null}
      },
      select: ["id"]
    });

  for (let i = 0; i < managers.length; i++) {
    const man = managers[i]
    man.permissions = man.permissions.map(it => it.type)
    man.points = man.points.map(it => it.id)
    const key = `manager:${man.telegramId}`;
    try {
      await client.set(key, JSON.stringify(man))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  }
}

const fetchDrinks = async () => {
  const st = Date.now()
  sails.log.warn("drinks fetching start")
  const drinks = await Drink.find()

  for (let i = 0; i < drinks.length; i++) {
    const man = drinks[i]
    const key = `drink:${man.id}`;
    try {
      await client.set(key, JSON.stringify(man))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  }

  sails.log.warn(`drinks fetched ${(Date.now() - st) / 1000}s, count:${drinks.length}`)
}

//redis
const fetchStatistics = async () => {
  const dates = []

  const st = Date.now()
  sails.log.warn("statistics fetching start")

  const end = moment().tz("Europe/Moscow").startOf("day").add(2, "day")
  const start = moment().tz("Europe/Moscow").startOf("month").add(-2, "month")
  while (start.isBefore(end)) {
    dates.push(start.format("DD-MM-YY"))
    start.add(1, "day")
  }
  const stats = await DayStatistic.find({statDay: dates}).select(['profit', 'sale', 'saleCount',  'point', 'records', 'statDay'])

  for (let i = 0; i < stats.length; i++) {
    const day = stats[i]
    const ex = Math.ceil((moment(day.statDay, 'DD-MM-YY').add(3, 'month').valueOf() - Date.now()) / 1000)
    const key = `stat:${day.point}_${day.statDay}`;
    try {
      await client.set(key, JSON.stringify(day), {EX: ex})
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }

  }

  statistics = stats.reduce((acc, cur) => {
    if (acc[cur.point]) {
      acc[cur.point][cur.statDay] = cur
    } else {
      acc[cur.point] = {
        [cur.statDay]: cur
      }
    }
    return acc
  }, {})


  sails.log.warn(`statistics fetched ${(Date.now() - st) / 1000}s, counts: ${stats.length}`)
}

//redis




const fetchStatuses = async () => {
  const st = Date.now()
  sails.log.warn("statuses fetching start")

  const machines = await CoffeeMachine.find({point: {"!=": null}}).select(['status', 'point'])

  for (let i = 0; i < machines.length; i++) {
    const log = machines[i]
    if (log) {
      const key = `status:${log.point}`;
      try {
        await client.set(key, log.status)
      } catch (e) {
        sails.log.error("CACHE SERVICE", e)
      }
    }
  }

  sails.log.warn(`statuses fetched ${(Date.now() - st) / 1000}s, count:${machines.length}`)
}



//redis


//redis
const fetchRedisCache = async () => {
  if (debug) return
  const st = Date.now()
  sails.log.warn("redis fetching start")
  await fetchManagers()
  await fetchStatistics()
  await fetchCities()
  await fetchStatuses()
  await fetchDrinks()
  sails.log.warn(`redis fetched ${(Date.now() - st) / 1000}s`)
}


const fetchManagerPoints = async () => {
  const st = Date.now()
  sails.log.warn("manager points fetching start")
  managerPoints = (await Manager.find()
      .select(["id"])
      .populate("points", {
        where: {
          coffeeMachine: {"!=": null},
          isArchive: false
        },
        select: ["id"]
      })
  ).reduce((acc, cur) => {
    acc[cur.id] = cur.points.map(it => it.id)
    return acc
  }, {})

  sails.log.warn(`manager points fetched ${(Date.now() - st) / 1000}s`)
}

const getManagerPoints = ({id}) => {
  return managerPoints[id] ?? []
}

const updateManagerPoints = async ({id, points, telegramId}) => {
  managerPoints[id] = points
  //redis
  if (!telegramId) return
  const key = `manager:${telegramId}`;
  let cache = await client.get(key)
  cache = JSON.parse(cache)
  cache.points = points
  try {
    await client.set(key, JSON.stringify(cache))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
}


const fetchPermissions = async () => {
  const st = Date.now()
  sails.log.warn("permissions fetching start")
  const managers = await Manager.find()
    .select(["telegramId", "permissions"])

  permissions = managers
    .reduce((acc, cur) => {
      if (cur.telegramId) {
        acc[cur.telegramId] = cur.permissions.map(it => it.type)
      }
      return acc
    }, {})
  sails.log.warn(`permissions fetched ${(Date.now() - st) / 1000}s,`)
}

const fetchCoffeeMachines = async () => {
  const start = Date.now()
  sails.log.warn("CoffeeMachines fetching start")
  let machines = await CoffeeMachine.find();
  coffeeMachines = machines.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  coffeeMachinesUpdatedAt = Date.now()
  for (let i = 0; i < machines.length; i++) {
    const man = machines[i]
    const key = `coffeeMachine:${man.id}`;
    try {
      await client.set(key, JSON.stringify(man))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  }

  sails.log.warn(`CoffeeMachines fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(coffeeMachines).length}`)
};

const fetchCities = async () => {
  const start = Date.now()
  sails.log.warn("Cities fetching start")
  const cit = await City.find();
  cities = cit.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});

  //redis
  for (let i = 0; i < cit.length; i++) {
    const doc = cit[i]
    const key = `city:${doc.id}`;
    try {
      await client.set(key, JSON.stringify(doc))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  }
  sails.log.warn(`Cities fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(cities).length}`)
};

const fetchPartners = async () => {
  const start = Date.now()
  sails.log.warn("Partners fetching start")
  partners = (await Partner.find().populate("cities", {select: ["id", "title"]}))
    .reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  partnersUpdatedAt = Date.now()
  sails.log.warn(`Partners fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(partners).length}`)
};

const fetchPoints = async () => {
  const start = Date.now()
  sails.log.warn("Points fetching start")
  const pts = await CoffeePoint.find();
  points = pts.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  pointsUpdatedAt = Date.now()

  //redis
  for (let i = 0; i < pts.length; i++) {
    const point = pts[i]
    const key = `point:${point.id}`;
    try {
      await client.set(key, JSON.stringify(point))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  }

  sails.log.warn(`Points fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(points).length}`)
};

const fetchProfits = async () => {
  const start = Date.now()
  sails.log.warn("Profits fetching start")
  const moments = {};
  Object.values(points)
    .filter(it => !!it.isArchive)
    .forEach(it => {
      try {
        moments[it.id] = moment().tz(cities[it.city]?.tz).format('DD-MM-YY');
      } catch (e) {

      }
    });

  for (const point in moments) {
    try {
      profits[point] = await DayStatistic.findOne({point, statDay: moments[point]}).select([ 'profit', 'sale']);
    } catch (e) {
      profits[point] = 0;
    }
  }
  sails.log.warn(`Profits fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(profits).length}`)
};

const logsByMachine = async (machine) => {

  try {
    const [info, warn, error] = await Promise.all([
      KaffitEvent.count({coffeeMachine: machine, isRead: false, type: 'info'}),
      KaffitEvent.count({coffeeMachine: machine, isRead: false, type: 'warn'}),
      KaffitEvent.count({coffeeMachine: machine, isRead: false, type: 'error'}),
    ])

    logs[machine] = {
      info,
      warn,
      error
    }
  } catch (e) {
    sails.log.error(e)
  }

};

const fetchLogsCounts = async () => {
  const start = Date.now()
  sails.log.warn("LogsCounts fetching start")
  const chunks = _.chunk(Object.keys(coffeeMachines).map(it => logsByMachine(it)), 5)
  for (let i = 0; i < chunks.length; i++) {
    await Promise.all(chunks[i]);
  }
  sails.log.warn(`LogsCounts fetched ${(Date.now() - start) / 1000}s counts: ${Object.values(logs).length}`)
};


const getCoffeeMachines = ({owner = null} = {}) => {
  return _.cloneDeep(Object.values(coffeeMachines)
    .filter(it => {
      if (owner) {
        return it.owner === owner;
      } else {
        return true;
      }
    }));
};

const getUsers = () => {
  return _.cloneDeep(Object.values(users));
};

const getUser = (id) => {
  return {...users[id]};
};

const getCities = ({owner = null} = {}) => {
  return _.cloneDeep(Object.values(cities)
    .filter(it => {
      if (owner) {
        return it.owner === owner;
      } else {
        return true;
      }
    }));
};

const getPartners = ({owner = null} = {}) => {
  return _.cloneDeep(Object.values(partners)
    .filter(it => {
      if (owner) {
        return it.owner === owner;
      } else {
        return true;
      }
    }));
};

const getStatistics = ({pointsId, dates}) => {
  let stats = pointsId.reduce((acc, cur) => {
    let pointStats = statistics[cur];
    if (pointStats) {
      dates.forEach(doc => {
        let dayStat = pointStats[doc];
        if (dayStat) acc.push(dayStat)
      })
    }
    return acc
  }, []);
  return _.cloneDeep(stats)
};

const getPermissions = ({telegramId}) => {
  return permissions[telegramId] ?? []
}

const updatePermissions = async (doc) => {
  if (!doc.telegramId) return
  permissions[doc.telegramId] = doc.permissions.map(it => it.type)

  //redis
  try {
    const key = `manager:${doc.telegramId}`;
    let cache = await client.get(key)
    cache = JSON.parse(cache) ?? {}
    cache.permissions = doc.permissions.map(it => it.type)
    try {
      await client.set(key, JSON.stringify(cache))
    } catch (e) {
      sails.log.error("CACHE SERVICE", e)
    }
  } catch (e) {

  }
}

const updateStatistics = async (doc) => {
  const ex = Math.ceil((moment(doc.statDay, 'DD-MM-YY').add(3, 'month').valueOf() - Date.now()) / 1000)
  const key = `stat:${doc.point}_${doc.statDay}`;
  try {
    await client.set(key, JSON.stringify(doc), {EX: ex})
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }


  if (statistics[doc.point]) statistics[doc.point][doc.statDay] = doc
  else {
    statistics[doc.point] = {
      [doc.statDay]: doc
    }
  }
}

const getPoints = ({owner = null, pointsId = []} = {}) => {
  return _.cloneDeep(Object.values(points)
    .filter(it => {
      if (owner) {
        return it.owner === owner;
      } else {
        return true;
      }
    })
    .filter(it => {
      if (pointsId.length > 0) {
        return pointsId.includes(it.id)
      } else {
        return true
      }
    })
  );
};

const getProfits = () => {
  return _.cloneDeep(profits);
};

const getLogs = () => {
  return _.cloneDeep(logs);
};

const updateProfit = (doc) => {
  profits[doc.point] = {
    profit: doc.profit,
    sale: doc.sale,
  };
};

const updateUser = (doc) => {
  users[doc.id] = {...users[doc.id], ...doc};
  usersUpdatedAt = Date.now()
};

const updateCoffeeMachine = async (doc) => {
  coffeeMachines[doc.id] = doc;
  coffeeMachinesUpdatedAt = Date.now()
  const keyK = `coffeeMachine:${doc.id}`;
  try {
    await client.set(keyK, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }

  //redis
  const key = `status:${doc.point}`;
  try {
    await client.set(key, doc.status)
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const updateDrink = async (doc) => {
  //redis
  const key = `drink:${doc.id}`;
  try {
    await client.set(key, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const removeCoffeeMachine = async (doc) => {
  delete coffeeMachines[doc.id];
  coffeeMachinesUpdatedAt = Date.now()
  const keyK = `coffeeMachine:${doc.id}`;
  try {
    await client.del(keyK)
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const updateCity = async (doc) => {
  cities[doc.id] = doc;

  const key = `city:${doc.id}`;
  try {
    await client.set(key, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const removeCity = async (doc) => {
  delete cities[doc.id];

  const key = `city:${doc.id}`;
  try {
    await client.del(key, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const updatePartner = (doc) => {
  partners[doc.id] = doc;
  partnersUpdatedAt = Date.now()
};

const removePartner = (doc) => {
  delete partners[doc.id];
  partnersUpdatedAt = Date.now()
};

const updatePoint = async (doc) => {
  points[doc.id] = doc;
  pointsUpdatedAt = Date.now()

  //redis
  const key = `point:${doc.id}`;
  try {
    await client.set(key, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};


const updateQuizz = async (doc) => {

  //redis
  const key = `quizz:${doc.id}`;
  try {
    await client.set(key, JSON.stringify(doc))
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
}

const removePoint = async (doc) => {
  delete points[doc.id];
  pointsUpdatedAt = Date.now()

  //redis
  try {
    await client.del(`point:${doc.id}`)
  } catch (e) {
    sails.log.error("CACHE SERVICE", e)
  }
};

const updateLog = (doc) => {
  try {
    if (logs[doc.coffeeMachine][doc.type]) {
      logs[doc.coffeeMachine][doc.type] = logs[doc.coffeeMachine][doc.type] + 1;
    } else {
      logs[doc.coffeeMachine][doc.type] = 1;
    }
  } catch (e) {

  }

};

const resetLog = (machine) => {
  logs[machine] = {
    info: 0,
    warn: 0,
    error: 0
  };
};

const getUsersUpdatedAt = () => {
  return usersUpdatedAt
}

const getCoffeeMachinesUpdatedAt = () => {
  return coffeeMachinesUpdatedAt
}

const getPartnersUpdatedAt = () => {
  return partnersUpdatedAt
}

const getPointsUpdatedAt = () => {
  return pointsUpdatedAt
}

const getStatusBySin = async (sin) =>{
  try {
    return await this.redis.get(`cm_status:${sin}`)
  } catch (e) {
    return "not-defined"
  }
}


const fetchRecords = async () => {
  await Promise.allSettled([fetchPermissions(), fetchPoints(), fetchPartners(), /*fetchCities(),*/ fetchCoffeeMachines()]);
  await fetchProfits();
  // await fetchStatistics();
  await fetchManagerPoints();
  // await fetchLogsCounts();


};

module.exports = {
  getCoffeeMachines,
  updateCoffeeMachine,
  getCities,
  updateCity,
  getPartners,
  updatePartner,
  getPoints,
  updatePoint,
  fetchRecords,
  getProfits,
  updateProfit,
  getLogs,
  updateLog,
  resetLog,
  removePartner,
  removeCity,
  removeCoffeeMachine,
  removePoint,
  getUsers,
  updateUser,
  getUser,
  getStatistics,
  getPermissions,
  updatePermissions,
  updateManagerPoints,
  updateStatistics,
  getManagerPoints,
  getUsersUpdatedAt,
  getCoffeeMachinesUpdatedAt,
  getPartnersUpdatedAt,
  getPointsUpdatedAt,
  updateQuizz,
  getStatusBySin,
  updateDrink,
  init
};



