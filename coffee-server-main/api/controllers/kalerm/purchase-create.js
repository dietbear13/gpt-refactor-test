const moment = require('moment-timezone');

module.exports = {

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    pinpadSin: {
      type: 'string',
      required: true
    },
    authCode: {
      type: 'string',
      required: true
    },
    operationId: {
      type: 'string',
      required: true
    },
    drink: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    amount: {
      type: 'number',
      required: true
    },
    snapshotAt: {
      type: 'number',
      required: true
    },
  },


  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
  },


  fn: async function ({
                        id,
                        pinpadSin,
                        authCode,
                        operationId,
                        drink,
                        snapshotAt,
                        title,
                        amount,
                      }, exits) {
    let purchaseId
    const sin = this.req.sin
    const point = this.req.point
    const coffeeMachine = this.req.id
    const partner = this.req.partner
    const owner = this.req.owner
    try {

      const pr = await Partner.findOne({id:partner})

      if(drink.length !== 24){
        await KaffitEvent.create({
          type: 'error',
          coffeeMachine: coffeeMachine,
          owner: owner,
          message: `Ошибка кофемашины - не обновлены напитки на КМ нет напитка с id ${drink}`,
        }).fetch();
      }

      const purchase = await Purchase.create({
        externalId: `${id}:${partner}:${coffeeMachine}`,
        title,
        amount,
        pinpadSin,
        authCode,
        operationId,
        sin,
        coffeeMachine,
        point,
        drink: drink.length !== 24 ? null : drink,
        partner,
        snapshotAt,
        owner
      })
        .intercept('E_UNIQUE', (err) => {
          return Purchase.findOne({externalId: `${id}:${partner}:${coffeeMachine}`})
        })
        .fetch()
      purchaseId = purchase.id


      if(pr.cloudKassa === 'atol'){
        const purchaseData = {
          timestamp: moment().tz('Europe/Moscow').format("DD.MM.YYYY HH:MM:SS"),
          external_id: `${id}:${partner}:${coffeeMachine}`,
          service: {
            callback_url: `https://crm.ooofortytwo.ru/api/v2/atol/receipt/${purchase.id}`
          },
          receipt: {
            client: {
              email: pr.email
            },
            company: {
              email: pr.email,
              inn: `${pr.inn}`,
              payment_address: "https://www.dobryicoffee.ru"
            },
            items: [
              {
                name: title,
                price: amount,
                quantity: 1,
                sum: amount,
                vat: {type: "none"}
              }
            ],
            payments: [
              {
                type: 1,
                sum: amount
              }
            ],
            total: amount
          }
        }
        try {
          const res = await AtolService.sendPurchase({partner, purchaseData})
          await Purchase.updateOne({id:purchaseId}).set({ status:'accepted', uuid:res.uuid})
        } catch (e) {
          Logger.purchaseError( e.message, `purchase ${purchaseId}`)
          await Purchase.updateOne({id:purchaseId}).set({error:e.message, status:'error'})
        }
      }else{

        const coffeePoint = await CoffeePoint.findOne({id:point}).select(["street", "house","howFind"]).populate("city")

        const orderData = {
          id: `${id}:${partner}:${coffeeMachine}`,
          inn: `${pr.inn}`,
          group: 'Vend_2',
          key: `${pr.inn}`,
          callbackUrl: `https://crm.ooofortytwo.ru/api/v2/orange/receipt/${purchase.id}`,
          callbackApiKey: `7f21b5056076670b5b1e80c59ac31c1b0998f1fea4c25baa60098d80c45dc531`,
          type: 1,
          customerContact: pr.email,
          taxationSystem: 1,
          automatNumber: sin.substring(4, sin.length),
          settlementAddress: `гор. ${coffeePoint.city.title}, ${coffeePoint.street} - ${coffeePoint.house}`,
          settlementPlace: `${coffeePoint.house}` + ` ${coffeePoint.howFind ? coffeePoint.howFind : ''}`
        }

        const positionData = {
          text: title,
          quantity: 1,
          price: amount.toFixed(2),
          tax: 6,
          paymentMethodType: 4,
          paymentSubjectType: 1,
        }

        try {
          const res = await OrangeDataService.sendPurchase({partner, orderData,positionData })
          await Purchase.updateOne({id:purchaseId}).set({ status:'accepted', uuid:res.uuid})
        } catch (e) {
          Logger.purchaseError( e.message, `purchase ${purchaseId}`)
          await Purchase.updateOne({id:purchaseId}).set({error:e.message, status:'error'})
        }
      }

      exits.success()
    } catch (err) {
      try{
        await Purchase.updateOne({id:purchaseId}).set({error:err.message})
      }catch (e) {
        //ignore
      }
      sails.log.error(`sin : ${this.req.sin}`, err)
      await KaffitEvent.create({
        type: 'error',
        coffeeMachine: coffeeMachine,
        owner: owner,
        message: `Ошибка кофемашины - создание платежа ${err.message}`,
      }).fetch();
      throw {serverError: {message: err.message}}
    }
  }
};


