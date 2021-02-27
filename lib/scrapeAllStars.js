const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllStars() {
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
      // winner: { name: tds[0].textContent.trim(), link: tds[0].querySelector('a').href },
      winner: [...tds[0].querySelectorAll('a')].map(a => ({ name: a.textContent.trim(), link: a.href })),
      runnerup: [...tds[1].querySelectorAll('a')].map(a => ({ name: a.textContent.trim(), link: a.href })),
      contestants: [...tds[2].querySelectorAll('a')].map(a => ({ name: a.textContent.trim(), link: a.href })),
    };
  })));
  //  console.log(JSON.stringify(seasonData, null, 2));

  fs.writeFileSync('./scrapeAllStars.json', JSON.stringify(seasonData, null, 2), (err) => {
    if(err){console.log(err);
    } else {console.log('Saved Successfully!');}
  });

  browser.close();
}

scrapeAllStars();
