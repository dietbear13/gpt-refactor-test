const axios = require('axios');
// https://sms.ru/code/call?phone=79255070602&ip=33.22.11.55&
module.exports = {
  async balance() {

    const [{balance}, {total_limit: limit, used_today: used}] = (await Promise.all([
      axios.get(
        `https://sms.ru/my/balance`,
        {
          params: {
            api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
            json: 1,
          }
        }),
      axios.get(
        `https://sms.ru/my/limit`,
        {
          params: {
            api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
            json: 1,
          }
        }
      )
    ])).map(it => it.data)
    return {balance, limit, used};
  },

  async sendSms({message, phone}) {
    let {data} = await axios.get(
      `https://sms.ru/sms/send`,
      {
        params: {
          api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
          to: `7${phone}`,
          msg: message,
          json: 1,
        }
      }
    );

    sails.log.warn('send sms', data);
    sails.log.warn(`send message <<${message}>> on phone <<+7${phone}>>`);
    return data;
  },

  async sendSmsMultiple({ids, message}) {

    const phones = CacheService.getUsers().filter(it => ids.includes(it.id)).map(it => `7${it.phone}`);

    const chunks = _.chunk(phones, 10);

    for (let i = 0; i < chunks.length; i++) {
      const phs = chunks[i].join(',');

      try {
        let {data} = await axios.get(
          `https://sms.ru/sms/send`,
          {
            params: {
              api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
              to: phs,
              msg: message,
              json: 1,
            }
          }
        );

        sails.log.warn('send sms', data);
        sails.log.warn(`send message <<${message}>> on phones <<${phs}>>`);
      } catch (e) {
        sails.log.error(e);
      }

    }
  },

  async costSmsMultiple({ids, message}) {

    const phones = CacheService.getUsers().filter(it => ids.includes(it.id)).map(it => `7${it.phone}`);

    // const phones = (await User.find({id:ids}).select(['phone'])).map(it => `7${it.phone}`);

    const chunks = _.chunk(phones, 10);
    let cost = 0;
    let count = 0;

    for (let i = 0; i < chunks.length; i++) {
      const phs = chunks[i].join(',');
      sails.log.warn('phones ', phs);

      try {
        let {data} = await axios.get(
          `https://sms.ru/sms/cost`,
          {
            params: {
              api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
              to: phs,
              msg: message,
              json: 1,
            }
          }
        );
        cost += data.total_cost;
        count += data.total_sms;
        sails.log.warn(data);
      } catch (e) {
        sails.log.error(e);
      }
    }
    return {cost, count};
  },


  async sendPhone({ip, phone}) {
    let {data} = await axios.get(
      `https://sms.ru/code/call`,
      {
        params: {
          api_id: '9b5f463c-05e4-d744-61e7-ea5bb1c80393',
          phone: `7${phone}`,
          // ip: ip,
          json: 1,
        }
      }
    );

    sails.log.warn('call on phone', data, `call <<${data.code}>> on phone <<+7${phone}>> ip <<${ip}>>`);
    if (data.status === 'ERROR') {
      if (data.status_text.includes('Слишком много звонков на один номер в сутки')) {
        throw Error('Слишком много звонков на один номер в сутки');
      }
    }
    return data.code;
  },
};
