const puppeteer = require('puppeteer');
const fs = require('fs');

async function requestQueenList() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_RuPaul%27s_Drag_Race_contestants', { waitUntil : 'domcontentloaded' });

  const [table] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[1]/tbody');
  const trs = await table.$$('tr');
  const trsTds = await Promise.all(trs.map(tr => tr.$$('td')));
  const seasons = [];
  for(const tds of trsTds) {
    if(tds.length === 5) {
      const seasonNum = await tds[0].evaluate(node => node.textContent.trim());
      seasons.push([seasonNum, {
        link: await tds[0].evaluate(node => node.querySelector('a').href),
        contestants: [],
      }]);
      seasons[seasons.length - 1][1].contestants.push({
        contestant: await tds[1].evaluate(node => node.textContent.trim()),
        contestantLink: await tds[1].evaluate(node => node.querySelector('a')?.href),
        age: await tds[2].evaluate(node => node.textContent.trim()),
        hometown: await tds[3].evaluate(node => node.textContent.trim()),
        ranking: await tds[4].evaluate(node => node.textContent.trim()),
      });
    } else if(tds.length === 4) { 
      
      seasons[seasons.length - 1][1].contestants.push({
        contestant: await tds[0].evaluate(node => node.textContent.trim()),
        contestantLink: await tds[0].evaluate(node => node.querySelector('a')?.href),
        age: await tds[1].evaluate(node => node.textContent.trim()),
        hometown: await tds[2].evaluate(node => node.textContent.trim()),
        ranking: await tds[3].evaluate(node => node.textContent.trim()),
      });
    }
  }
  
  fs.writeFileSync('./queensList.json', JSON.stringify(Object.fromEntries(seasons), null, 2), (err) => {
    if(err){console.log(err);
    } else {console.log('Saved Successfully!');}
  });
  
  browser.close();
}

requestQueenList();
