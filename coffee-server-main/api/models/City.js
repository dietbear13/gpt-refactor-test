const tz = [
  {tzid:"Europe/Kaliningrad", title: "Калининград", offset:"+02:00"	, mskOffset:"MSK-01", coverage:"Калининградская область"},
  {tzid:"Europe/Moscow", title: "Москва", offset:"+03:00", mskOffset:"MSK+00", coverage:"Большая часть европейской части России"},
  {tzid:"Europe/Volgograd", title: "Волгоград", offset:"+03:00", mskOffset:"MSK+00",	coverage:"Кировская область, Саратовская область, Волгоградская область, Астраханская область"},
  {tzid:"Europe/Samara", title: "Самара, Удмуртия", offset:"+04:00"	, mskOffset:"MSK+01", coverage:"Самарская область и Удмуртия"},
  {tzid:"Europe/Ulyanovsk", title: "Ульяновск", offset:"+04:00"	, mskOffset:"MSK+01", coverage:"Ульяновская область"},
  {tzid:"Asia/Yekaterinburg", title:"Урал", offset:"+05:00"	, mskOffset:"MSK+02", coverage:"Башкортостан, Челябинская область, Ханты-Мансийский автономный округ, Курганская область, Оренбургская область, Пермский край, Свердловская область, Тюменская область, Ямалия"},
  {tzid:"Asia/Omsk", title: "Омск", offset:"+06:00", mskOffset:"MSK+03", coverage:"Алтайский край, Республика Алтай и Омская область"},
  {tzid:"Asia/Novosibirsk", title: "Новосибирск", offset:"+07:00", mskOffset:"MSK+04",	coverage:"Новосибирская область и Томская область"},
  {tzid:"Asia/Novokuznetsk", title: "Кемерово", offset:"+07:00", mskOffset:"MSK+04",	coverage:"Кемеровская область"},
  {tzid:"Asia/Krasnoyarsk", title: "Красноярский край", offset:"+07:00", mskOffset:"MSK+04",	coverage:"Хакасия, Красноярский край и Республика Тыва"},
  {tzid:"Asia/Irkutsk", title: "Иркутск, Бурятия", offset:"+08:00", mskOffset:"MSK+05",	coverage:"Иркутская область и Бурятия"},
  {tzid:"Asia/Yakutsk", title: "Река Лена", offset:"+09:00", mskOffset:"MSK+06",	coverage:"Амурская область, Забайкальский край и западная республика Саха"},
  {tzid:"Asia/Vladivostok", title: "Река Амур", offset:"+10:00", mskOffset:"MSK+07",	coverage:"Еврейская автономная область, Хабаровский край, Приморский край и центральная республика Саха"},
  {tzid:"Asia/Sakhalin", title: "О. Сахалин", offset:"+11:00", mskOffset:"MSK+08",	coverage:"Остров Сахалин и западные Курильские острова"},
  {tzid:"Asia/Ust-Nera", title: "Оймяконский", offset:"+10:00", mskOffset:"MSK+07",	coverage:"Оймяконский район"},
  {tzid:"Asia/Magadan", title: "Магадан", offset:"+11:00", mskOffset:"MSK+08",	coverage:"Магаданская область"},
  {tzid:"Asia/Srednekolymsk", title: "Саха, Северные Курилы", offset:"+11:00", mskOffset:"MSK+08",coverage:"Восточные Курильские острова и восточная Республика Саха"},
  {tzid:"Asia/Kamchatka", title: "Камчатка", offset:"+12:00", mskOffset:"MSK+09",coverage:"Камчатский край"},
  {tzid:"Asia/Anadyr", title: "Берингово море", offset:"+12:00", mskOffset:"MSK+09",coverage:"Чукотский автономный округ"},
  {tzid:"Asia/Anadyr", title: "Берингово море", offset:"+13:00", mskOffset:"MSK+10",coverage:"Чукотский автономный округ"},
]

module.exports = {
  attributes: {
    title: {
      type: 'string',
      unique: true
    },
    geo: {
      type: 'json',
      defaultsTo: {
        lat: null,
        long: null
      }
    },
    maxPrice: {
      type: 'number',
      defaultsTo: 119
    },
    tz: {
      type: 'string',
      defaultsTo: "Europe/Moscow"
    },
    points: {
      collection: 'coffeepoint',
      via: 'city'
    },
    partners: {
      collection: 'partner',
      via: 'cities',
    }
  },

  async findFull({id}){
    let city = await City.findOne({id})
      .populate("partners", {select:["title"]})
      .populate("points", {select:["title"]})

    let {title, mskOffset} = tz.find(it => it.tzid === city.tz);
    city.tz = `${title} ${mskOffset}`
    return city
  },

  afterCreate: async function (newRecord, proceed) {
     CacheService.updateCity(newRecord)
    return proceed();
  },

  afterUpdate: async function (updatedRecord, proceed) {
     CacheService.updateCity(updatedRecord)
    return proceed();
  },

  afterDestroy: async function (updatedRecord, proceed) {
    CacheService.removeCity(updatedRecord)
    return proceed();
  },

  findTz: async function (id) {
    let city = await City.findOne({id}).select(["tz"])
    return city.tz
  },

  tz:tz
}
