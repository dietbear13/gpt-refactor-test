const records = [
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "isFree":true,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d631888925726",
    "title": "Латте Биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "snapshotAt": Date("1684281660000")
  }
]
const records2 = [
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "isFree":true,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 0,
    "isFree":true,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d63188892571d",
    "title": "Капучино биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d631888925726",
    "title": "Латте Биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d631888925726",
    "title": "Латте Биг",
    "amount": 119,
    "profit": 82,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "snapshotAt": Date("1684281660000")
  },
  {
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "isFree":true,
    "snapshotAt": Date("1684281660000")
  },{
    "drink": "63b70f3d1a9d6318889256f0",
    "title": "Флэт Уайт",
    "amount": 119,
    "profit": 84,
    "isFree":true,
    "snapshotAt": Date("1684281660000")
  }
]



const mergeDiff = (old, current)=>{
  const reduceStat = (arr)=>{
    return arr.reduce((acc, cur)=>{
      if(!!acc[cur.drink+'_'+cur.isFree]) acc[cur.drink+'_'+cur.isFree] = acc[cur.drink+'_'+cur.isFree] +1
      else acc[cur.drink+'_'+cur.isFree] = 1
      return acc
    },{})
  }

  const one = reduceStat(old)
  const two = reduceStat(current)
  const result = [...old]

  for (const key in two) {
    let keys = key.split("_");
    let drink = current.find(it => it.drink === keys[0] && it.isFree === (keys[1]==='true' ? true : undefined));
    if(one.hasOwnProperty(key) && two[key]>one[key]){

      for (let i = 0; i < two[key]-one[key]; i++) {
        result.push(drink)
      }

    }else if(!one.hasOwnProperty(key)){
      for (let i = 0; i < two[key]; i++) {
        result.push(drink)
      }
    }
  }

  return result
}

const result = mergeDiff(records,records2)

console.log( records2.length, records.length, result.slice(records.length), "result", result)
