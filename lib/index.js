const puppeteer = require('puppeteer');

async function queenLinks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars', { waitUntil : 'domcontentloaded' });
  
  const [table] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[3]/tbody');

  const trows = await table.$$('tr');
  const seasonData = await Promise.all(trows.slice(1).map(tr => tr.evaluate(node => {
    const a = node.querySelector('th a');
    const tds = node.querySelectorAll('td');

    return {
      season: { number: a.textContent, link: a.href },
      winner: { name: tds[0].textContent.trim(), link: tds[0].querySelector('a').href },
      runnerup: [...tds[1].querySelectorAll('a')].map(a => ({ name: a.textContent.trim(), link: a.href })),
      contestants: [...tds[2].querySelectorAll('a')].map(a => ({ name: a.textContent.trim(), link: a.href })),
    };
  })));
 console.log(JSON.stringify(seasonData, null, 2));

  // let trows = await table.$$('tr');
  // trows = [...trows].slice(1);

  // let rowData = await Promise.all(trows.map(row => row.$$('td')));
  // rowData = rowData.map(row => [...row]);
  // rowData = rowData.map(row => row.slice(0, 4));
  // rowData = await Promise.all(
  //   rowData.map(row => {
  //     return Promise.all(
  //       row.map(col => {
  //         return col.$$eval('a', nodeList => nodeList.map(node => node.href));
  //       })
  //     );
  //   })
  // );
  // console.log(rowData);

  // const seasons = await Promise.all(trows.map(row => {
  //   const season = row.$$eval('th', node => node.$$eval('a', a => {
  //     return {
  //       seasonNum: a.textContent,
  //       seasonLink: a.href,
  //     };
  //   }));

    // const col = await row.$$('td');
    // const winners = col[1].$$eval('a', nodeList => nodeList.map(node => {
    //   return {
    //     winner: node.textContent,
    //     winnerLink: node.href,
    //   };
    // }));

//     return season;
//   }));

// console.log(seasons);


  // const trsTds = await Promise.all(trows.map(tr => tr.$$('td')));
  // const allStars = [];

  // for(const tr of trows){

  //   // const seasonNum = await tr.$eval('th', node => node.textContent);
  //   const winners = await tr.$$eval('td', node => {
  //     return [...node.querySelectorAll('a')]
  //       .map(a => ({
  //         winner: a.textContent,
  //         link: a.href
  //       }));
  //   });
  //   console.log(winners);

  // //   // const tableData = await tr.$$eval('td', node => node);
  // }

  browser.close();
}

queenLinks();

// const [table] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[3]/tbody');
//   const trows = await table.$$('tr');
//   // const trsTds = await Promise.all(trows.map(tr => tr.$$('td')));
//   const allStars = [];

  // for(const tr of trows){

  //   // RETURNS ALL DATA FROM EACH ROW:
  //   // for(const tr of trows){
  //   //   const tableData = await tr.evaluate(node => node.innerText.trim());
  //   //   console.log(tableData);

  //   //RETURNS AN ARRAY OF ALL DATA AND PUSHES EACH ROW INTO WINNER OBJ:
  //   // const tableData = await tr.evaluate(node => node.textContent.trim());
  //   // allStars.push([tableData, []]);
  //   // allStars[allStars.length - 1][1].push({
  //   //   winner: await tr.evaluate(node => node.textContent.trim()),
  //   // });

  //   //RETURNS AN ARRAY OF:
  //   // []
  //   // [ [ 'Chad Michaels', [ [Object] ] ] ]
  //   // [ [ 'Chad Michaels', [ [Object] ] ], [ 'Alaska', [ [Object] ] ] ]
  //   // REPEATS 3 MORE TIMES

  //   // if(tds.length === 6) {
  //   //   const tableData = await tds[0].evaluate(node => node.innerText.trim());
  //   //   allStars.push([tableData, []]);
  //   //   allStars[allStars.length - 1][1].push({
  //   //     winner: await tds[1].evaluate(node => node.textContent.trim()),
  //   //   });
  //   // }

  //   const tableData = await tr.$$eval('td', node => node);

  //   console.log(tableData);
  // }

   //THIS RETURN ONLY PARTS OF WINNERS
  // const trs = await table.$$('tr');
  // const trsTds = await Promise.all(trs.map(tr => tr.$$('td')));
  // console.log(trsTds.length);
  // const allStars = [];

  // for(const tds of trsTds) {
  //   if(tds.length === 6){
  //     const allStarsNum = await tds[0].evaluate(node => node.textContent.trim());
  //     allStars.push([allStarsNum, []]);
  //     allStars[allStars.length - 1][1].push({
  //       winner: await tds[1].evaluate(node => node.textContent.trim()),
  //       runnerup: await tds[2].evaluate(node => node.textContent.trim()),
  //       contestant: await tds[3].evaluate(node => node.textContent.trim()),
  //     });
  //     console.log(allStarsNum);
  //   }
  // }

  //DOES NOT WORK
  // const [a] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[1]/tbody');
  // const links = await a.evaluate(() => {
  //   const nodeList = document.querySelectorAll('table[class="wikitable"] > tbody > tr > td > b');
  //   const linkArray = [];
  //   for(const i = 0; i < nodeList.length; i++) {
  //     linkArray[i] = {
  //       seasonLink: nodeList[i].innerHTML('href'),
  //       seasonQueen: nodeList[i].innerText.trim()
  //     };
  //   }
  //   return linkArray;
  // });

  // console.log(links);