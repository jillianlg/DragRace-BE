const puppeteer = require('puppeteer');
const fs = require('fs');

async function refactorDragRace() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_RuPaul%27s_Drag_Race_contestants', { waitUntil : 'domcontentloaded' });

  const [table] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[1]/tbody');
  const seasons = await table.evaluate(node => {
    const trs = [...node.querySelectorAll('tr')];
    return trs.reduce((acc, tr) => {
      const tds = tr.querySelectorAll('td');
      if(tds.length === 5) {
        acc.push({
          season: {
            number: tds[0].textContent.replace('Season', '').trim(),
            link: tds[0].querySelector('a').href,
          },
          contestants: [{
            name: tds[1].textContent.trim(),
            link: tds[1].querySelector('a')?.href,
            age: tds[2].textContent.trim(),
            hometown: tds[3].textContent.trim(),
            ranking: tds[4].textContent.trim(),
          }],
        });

      } else if(tds.length === 4) {
        acc[acc.length - 1].contestants.push({
          name: tds[0].textContent.trim(),
          link: tds[0].querySelector('a')?.href,
          age: tds[1].textContent.trim(),
          hometown: tds[2].textContent.trim(),
          ranking: tds[3].textContent.trim(),
        });
      }
      return acc;
    }, []);
  });
  
  
  // console.log(JSON.stringify(seasons, null, 2));
  fs.writeFileSync('./scrapeDragRace.json', JSON.stringify((seasons), null, 2), (err) => {
    if(err){console.log(err);
    } else {console.log('Saved Successfully!');}
  });

  browser.close();
}

refactorDragRace();
