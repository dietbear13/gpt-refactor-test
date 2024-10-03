const xl = require('excel4node');
const moment = require('moment');

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getMomentIntervals = (start, end) => {
  const s = start.clone().startOf("day")
  const e = end.clone().startOf("day")
  const arr = [s.format("DD-MM-YY")]

  while (s.isBefore(e)) {
    s.add(1, "day")
    arr.push(s.format("DD-MM-YY"))
  }
  return arr
}

const createHeader = ({ws, row, data, style}) => {
  data.forEach((cur, ind) => {
    ws.cell(row, ind + 1)
      .string(cur)
      .style(style)
  })
}

const createRow = ({ws, row, data, style}) => {

  data.forEach((cur, ind) => {
    if(ind>4){
      ws.cell(row, ind + 1)
        .number(cur)
        .style(style)
    }else{
      ws.cell(row, ind + 1)
        .string(cur)
        .style(style)
    }

  })
}

const createReport = async ({wb, partner, start, end, headerStyle, cellStyle}) => {
  let pts = await CoffeePoint.find({
    partner,
    isArchive: false
  }).select(['id', 'title', 'street', 'house'])
    .populate("city")
    .populate('coffeeMachine')
    .populate('partner')

  const days = getMomentIntervals(moment(start), moment(end))

  let pr = await Partner.findOne({id: partner}).select(['id', 'title'])
  let points = pts.map(it => it.id);
  const stats = await DayStatistic.find({
    point: points,
    statDay: days
  }).select(['statDay', 'point', 'saleCount', 'sale', 'free', 'freeCount']);

  const data = _.groupBy(stats, (it) => it.point)

  //отчет по точкам
  const ws = wb.addWorksheet(pr.title);
  let indx = 1
  const result = []
  for (const key in data) {
    createHeader({
      ws,
      row:indx,
      data: ['Город', 'Партнер', 'Точка', 'Серийный номер КМ','Дата', 'Продажи (₽)', 'Продажи (ч)', 'Кешбек (₽)', 'Кешбек (ч)', 'Всего (₽)', 'Всего (ч)'],
      style: headerStyle
    })

    const item = data[key];
    const p = pts.find(it => it.id === key)

    item.forEach((datum) => {
      indx = indx+1
      const arr = [p.city.title, p.partner.title, p.title, p.coffeeMachine.sin, datum.statDay, datum.sale, datum.saleCount, datum.free, datum.freeCount, datum.sale + datum.free, datum.saleCount + datum.freeCount]
      createRow({ws, row: indx, data: arr, style: cellStyle})
    })
    indx = indx+1
    const total = [p.city.title, p.partner.title, p.title, p.coffeeMachine.sin, moment(start).format("DD.MM.YY")+"-"+ moment(end).format("DD.MM.YY"), _.sum(item.map(it => it.sale)), _.sum(item.map(it => it.saleCount)), _.sum(item.map(it => it.free)), _.sum(item.map(it => it.freeCount)), _.sum([...item.map(it => it.sale), ...item.map(it => it.free)]), _.sum([...item.map(it => it.saleCount), ...item.map(it => it.freeCount)])]
    createRow({ws, data: total, row: indx, style: cellStyle})
    result.push(total)
    indx= indx+2
  }

  ws.column(1).setWidth(30);
  ws.column(2).setWidth(50);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(40);
  ws.column(5).setWidth(20);
  ws.column(6).setWidth(20);
  ws.column(7).setWidth(20);
  ws.column(8).setWidth(20);
  ws.column(9).setWidth(20);
  ws.column(10).setWidth(20);
  ws.column(11).setWidth(20);
  return result
}

const weekReports = async () => {
  const prs = (await Partner.find({isArchive: false, type: "coffeemachine"}).select(["id"])).map(it => it.id)
  const start = moment().add(-2, "day").startOf('week').add(1, "day")
  const end = start.clone().add(6, 'days')
  const wb = new xl.Workbook({dateFormat: 'dd-mm-yy'});
  const headerStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      top: {
        style: 'medium',
        color: "black"
      },
      bottom: {
        style: 'medium',
        color: "black"
      },
      left: {
        style: 'medium',
        color: "black"
      },
      right: {
        style: 'medium',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 14,
      bold: true
    },
  });
  const cellStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      bottom: {
        style: 'thin',
        color: "black"
      },
      left: {
        style: 'thin',
        color: "black"
      },
      right: {
        style: 'thin',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 12,
    },
  });
  let  indx = 1
  const ws = wb.addWorksheet("Срез за неделю");
  createHeader({ws, row:indx, data:['Город', 'Партнер', 'Точка', 'Серийный номер КМ','Дата', 'Продажи (₽)', 'Продажи (ч)', 'Кешбек (₽)', 'Кешбек (ч)', 'Всего (₽)', 'Всего (ч)'], style:headerStyle })
  ws.column(1).setWidth(30);
  ws.column(2).setWidth(50);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(40);
  ws.column(5).setWidth(20);
  ws.column(6).setWidth(20);
  ws.column(7).setWidth(20);
  ws.column(8).setWidth(20);
  ws.column(9).setWidth(20);
  ws.column(10).setWidth(20);
  ws.column(11).setWidth(20);


  for (let i = 0; i < prs.length; i++) {
    try {
      const result = await createReport({wb, partner: prs[i], start: start.valueOf(), end: end.valueOf(), headerStyle, cellStyle})
      sails.log.error("result", result)

      result.forEach((it)=>{
        indx = indx+1
        createRow({ws, row: indx, data:it, style:cellStyle})
      })
    } catch (e) {
      sails.log.error(e)
    }
  }

  const fileName = `Еженедельный отчет ${moment(start).format('DD-MM-YY')}_${moment(end).format('DD-MM-YY')}.xlsx`.trim()
  wb.write(`./reports/${fileName}`);
  await delay(1000)
  await BotService.sendDoc({
    title: fileName
  })

}

const intervalReports = async ({start:s, end:e}) => {
  const prs = (await Partner.find({isArchive: false, type: "coffeemachine"}).select(["id"])).map(it => it.id)
  const start = moment(s).startOf('day')
  const end = moment(e).endOf('day')
  const wb = new xl.Workbook({dateFormat: 'dd-mm-yy'});
  const headerStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      top: {
        style: 'medium',
        color: "black"
      },
      bottom: {
        style: 'medium',
        color: "black"
      },
      left: {
        style: 'medium',
        color: "black"
      },
      right: {
        style: 'medium',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 14,
      bold: true
    },
  });
  const cellStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      bottom: {
        style: 'thin',
        color: "black"
      },
      left: {
        style: 'thin',
        color: "black"
      },
      right: {
        style: 'thin',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 12,
    },
  });
  let  indx = 1
  const ws = wb.addWorksheet(`Срез c ${start.format('DD-MM-YY')} по ${end.format('DD-MM-YY')}`);
  createHeader({ws, row:indx, data:['Город', 'Партнер', 'Точка', 'Серийный номер КМ','Дата', 'Продажи (₽)', 'Продажи (ч)', 'Кешбек (₽)', 'Кешбек (ч)', 'Всего (₽)', 'Всего (ч)'], style:headerStyle })
  ws.column(1).setWidth(30);
  ws.column(2).setWidth(50);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(40);
  ws.column(5).setWidth(20);
  ws.column(6).setWidth(20);
  ws.column(7).setWidth(20);
  ws.column(8).setWidth(20);
  ws.column(9).setWidth(20);
  ws.column(10).setWidth(20);
  ws.column(11).setWidth(20);


  for (let i = 0; i < prs.length; i++) {
    try {
      const result = await createReport({wb, partner: prs[i], start: start.valueOf(), end: end.valueOf(), headerStyle, cellStyle})

      result.forEach((it)=>{
        indx = indx+1
        createRow({ws, row: indx, data:it, style:cellStyle})
      })
    } catch (e) {
      sails.log.error(e)
    }
  }

  const fileName = `Отчет ${moment(start).format('DD-MM-YY')}_${moment(end).format('DD-MM-YY')}.xlsx`.trim()
  wb.write(`./reports/${fileName}`);
  await delay(1000)
  await BotService.sendDoc({
    title: fileName
  })

}

const monthReports = async () => {
  const prs = (await Partner.find({isArchive: false, type: "coffeemachine"}).select(["id"])).map(it => it.id)
  const start = moment().add(-1, "day").startOf('month')
  const end = start.clone().endOf('month')
  const wb = new xl.Workbook({dateFormat: 'dd-mm-yy'});
  const headerStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      top: {
        style: 'medium',
        color: "black"
      },
      bottom: {
        style: 'medium',
        color: "black"
      },
      left: {
        style: 'medium',
        color: "black"
      },
      right: {
        style: 'medium',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 14,
      bold: true
    },
  });
  const cellStyle = wb.createStyle({
    alignment: {
      horizontal: 'center'
    },
    border: {
      bottom: {
        style: 'thin',
        color: "black"
      },
      left: {
        style: 'thin',
        color: "black"
      },
      right: {
        style: 'thin',
        color: "black"
      }
    },
    font: {
      color: 'black',
      size: 12,
    },
  });
  let  indx = 1
  const ws = wb.addWorksheet("Срез за месяц");
  createHeader({ws, row:1, data:['Город', 'Партнер', 'Точка', 'Серийный номер КМ','Дата', 'Продажи (₽)', 'Продажи (ч)', 'Кешбек (₽)', 'Кешбек (ч)', 'Всего (₽)', 'Всего (ч)'], style:headerStyle })
  ws.column(1).setWidth(40);
  ws.column(2).setWidth(50);
  ws.column(3).setWidth(50);
  ws.column(4).setWidth(50);
  ws.column(5).setWidth(30);
  ws.column(6).setWidth(20);
  ws.column(7).setWidth(20);
  ws.column(8).setWidth(20);
  ws.column(9).setWidth(20);
  ws.column(10).setWidth(20);
  ws.column(11).setWidth(20);

  for (let i = 0; i < prs.length; i++) {
    try {
      const result = await createReport({wb, partner: prs[i], start: start.valueOf(), end: end.valueOf(), headerStyle, cellStyle})
      result.forEach((it)=>{
        indx = indx+1
        createRow({ws, row: indx, data:it, style:cellStyle})
      })
    } catch (e) {
      sails.log.error(e)
    }
  }

  const fileName = `Ежемесячный отчет ${moment(start).format('DD-MM-YY')}_${moment(end).format('DD-MM-YY')}.xlsx`.trim()
  wb.write(`./reports/${fileName}`);
  await delay(1000)
  await BotService.sendDoc({
    title: fileName
  })
}


module.exports = {
  weekReports,
  monthReports,
  intervalReports,
  createReport,
};
