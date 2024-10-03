/* eslint-disable quotes,linebreak-style */
const managers = [
  {
    name: "Михаил Макеев",
    login: "makweb@yandex.ru",
    password: "superadmin",
    role: "superadmin",
  }
]

const cities = [
  {
    title: "Тольятти",
    tz: "Europe/Samara"
  },
  {
    title: "Самара",
    tz: "Europe/Samara"
  }
]

const partner = {
  title: "Добрый кофе",
  phone: "89179711111",
  inn: "00000000",
  credentials: {
    email: "Soper_dobryi-coffee",
    password: "dc_soper"
  },
  owner: "dobriyCoffee"
}


const drinks = [
  {
    title: "Эспрессо",
    price: 39,
    strength: 5,
    volume: 50,
    composition: "кофе + вода",
    position: 1,
    // externalId: "601d1bfb62b42833a8cdecab",//
    slug: "sdk_k95_drink_item_01__50",
    water: 50,
    milk: 0,
    coffee: 9,
    costPrice: 17
  },
  {
    title: "Эспрессо Биг",
    price: 69,
    strength: 5,
    volume: 100,
    composition: "кофе + вода",
    position: 2,
    // externalId: "601d1bfb62b42833a8cdecaa",//
    slug: "sdk_k95_drink_item_double_01__100",
    water: 100,
    milk: 0,
    coffee: 12,
    costPrice: 20
  },
  {
    title: "Американо Биг",
    price: 69,
    strength: 4,
    volume: 300,
    composition: "кофе + вода",
    position: 3,
    // externalId: "601d1bfb62b42833a8cdeca9",
    slug: "sdk_k95_drink_item_02__300",
    water: 300,
    milk: 0,
    coffee: 12,
    costPrice: 20
  },
  {
    title: "Американо",
    price: 39,
    strength: 4,
    volume: 150,
    composition: "кофе + вода",
    position: 4,
    // externalId: "601d1bfb62b42833a8cdeca8",
    slug: "sdk_k95_drink_item_02__150",
    water: 150,
    milk: 0,
    coffee: 9,
    costPrice: 17
  },
  {
    title: "Капучино",
    price: 69,
    strength: 3,
    volume: 200,
    composition: "кофе + молоко",
    position: 5,
    //externalId: "601d1bfb62b42833a8cdeca7",
    slug: "sdk_k95_drink_item_04__200",
    water: 100,
    milk: 90,
    coffee: 9,
    costPrice: 24
  },
  {
    title: "Латте",
    price: 69,
    strength: 2,
    volume: 200,
    composition: "кофе + молоко",
    position: 6,
    //externalId: "601d1bfb62b42833a8cdeca6",
    slug: "sdk_k95_drink_item_06__200",
    water: 100,
    milk: 90,
    coffee: 9,
    costPrice: 23
  },
  {
    title: "Капучино биг",
    price: 90,
    strength: 3,
    volume: 300,
    composition: "кофе + молоко",
    position: 7,
    //externalId: "601d1bfb62b42833a8cdeca5",
    slug: "sdk_k95_drink_item_04__300",
    water: 200,
    milk: 150,
    coffee: 12,
    costPrice: 29
  },
  {
    title: "Латте Биг",
    price: 90,
    strength: 2,
    volume: 300,
    composition: "кофе + молоко",
    position: 8,
    // externalId: "601d1bfb62b42833a8cdeca4",
    slug: "sdk_k95_drink_item_06__300",
    water: 200,
    milk: 150,
    coffee: 12,
    costPrice: 28
  }
]

const points = [
  {
    title: "Автомир",
    description: "Какое то описание",
    sin: "mK96L2102260000673ce9ed3",
    street: "",
    house: "",
    city: "Тольятти",
    geo: {
      lat: null,
      long: null
    },
    howFind: "",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "9:00 - 20:00",
      sat: "10:00 - 20:00",
      sun: "Выходной",
    },
  },
  {
    title: "Кедр",
    description: "Какое то описание",
    sin: "mK9501012000000b34f628",
    street: "",
    house: "",
    city: "Тольятти",
    geo: {
      lat: null,
      long: null
    },
    howFind: "",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "9:00 - 20:00",
      sat: "10:00 - 20:00",
      sun: "Выходной",
    },
  },
  {
    title: "ГМ Московский",
    description: "Какое то описание",
    sin: "mK95L21060400002f550f9d",
    street: "",
    house: "",
    city: "Тольятти",
    geo: {
      lat: null,
      long: null
    },
    howFind: "",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "9:00 - 20:00",
      sat: "10:00 - 20:00",
      sun: "Выходной",
    },
  },
  {
    title: "Парк-Хаус",
    description: "Какое то описание",
    sin: "mK95L21060400004053e37c",
    street: "Автозаводское ш.",
    house: "6",
    city: "Самара",
    geo: {
      lat: null,
      long: null
    },
    howFind: "Второй этаж",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "10:00 - 20:00",
      sat: "10:00 - 20:00",
      sun: "10:00 - 20:00",

    },
  },
  {
    title: "Высота",
    description: "",
    sin: "mK95L21060400006e764d32",
    street: "",
    house: "",
    city: "Тольятти",
    geo: {
      lat: null,
      long: null
    },
    howFind: "",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "10:00 - 20:00",
      sat: "Выходной",
      sun: "Выходной",
    }
  },
  {
    title: "Добрый кофе",
    description: "",
    sin: "mK95L2106040000b7a432fe",
    street: "",
    house: "",
    city: "Тольятти",
    geo: {
      lat: null,
      long: null
    },
    howFind: "",
    schedule: {
      mon: "10:00 - 20:00",
      tue: "10:00 - 20:00",
      wed: "10:00 - 20:00",
      thu: "10:00 - 20:00",
      fri: "10:00 - 20:00",
      sat: "Выходной",
      sun: "Выходной",
    }
  },

]

const moment = require('moment');

module.exports = {
  async recalculateLastVisit(){
    console.log(`recalculateLastVisit`)
    const users = await User.find().select(["lastVisit"])


    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      if(Math.abs(moment(user.lastVisit).diff(moment(), 'days'))>30){
        await User.updateOne({id:user.id}).set({returnedDate: user.lastVisit})
        console.log(`update ${i}/${users.length} returnedDate: ${user.lastVisit}`)
      }else{
        console.log(`diff`,Math.abs(moment(user.lastVisit).diff(moment(), 'days')))
      }
    }
  },

  async recalculateTotals(){
    console.log(`recalculateTotals`)
    const users = await User.find({
      or : [
        {spendCount: {'>':0}},
        {saveCount: {'>':0}},
        {balance:{'>':0}},
      ]
    }).select(["id"])
      .populate('spends', {select:['amount']})
      .populate('saves', {select:['cashback']})
      .populate('promocodes', {select:['amount']})


    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const save = user.saves.reduce((acc, cur)=> acc + cur.cashback, 0)
      const promo = user.promocodes.reduce((acc, cur)=> acc + cur.amount, 0)
      const spend = user.spends.reduce((acc, cur)=> acc + cur.amount, 0)
      await User.updateOne({id:user.id}).set({spendTotal: spend, saveTotal:save+promo})
      console.log(`update ${i}/${users.length} save: ${save} promo:${promo} spend:${spend} user:`, user)
    }
  },

  async generateCities() {
    if (await City.count() === 0) {
      await City.createEach(cities)
      console.log('Cities generate')
    }
  },


  async generatePoints() {
    let c = await City.find()
    let p = await Partner.findOne({title: "Добрый кофе"})
    if (await CoffeePoint.count() === 0) {
      let cp = points.map(it => {
        it.city = c.find(cc => cc.title === it.city).id
        it.partner = p.id
        return it
      })
      await CoffeePoint.createEach(cp)
      console.log('CofeePoints generate')
    }
  },

  async generatePartners() {

    if (await Partner.count() === 0) {
      let c = await City.findOne({title: "Тольятти"})
      let p = await Partner.create(partner).fetch()
      await Partner.addToCollection(p.id, "cities").members(c.id)
    }
  },

  async generateDrinks() {
    if (await Drink.count() === 0) {
      await Drink.createEach(drinks)
      console.log('Cities generate')
    }
  },

  async generateManagers() {
    if (await Manager.count() === 0) {
      await Manager.createEach(managers)
      console.log('Manager generate')
    }

  },

  async migrateSpends(){
    const drinks = (await Drink.find().select(["title", "volume"])).reduce((acc, cur) => {
      acc[cur.id] = cur.title + " " + cur.volume
      return acc
    }, {})

    const spends = await Spend.find().select(["id","drink"])

    for (let i = 0; i < spends.length; i++) {
      const id = spends[i].id
      const title = drinks[spends[i].drink] || "Кофе"
      console.log("title " + title + " " + id + " " + i+"/"+spends.length)
      await Spend.updateOne({id}).set({title:title})
    }

  }
}
