const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.autohome.com.cn/AreaList.html');
    // await page.screenshot({path: 'example.png',fullPage:true});

    // let cityListDiv= await page.$$(".mainWrap .t0.font14WithLine");

    const prAndCity = await page.evaluate(( )=> {
        let cityMap=new Object();
        let province;
        let citys=[];
        const cityListDiv =document.querySelectorAll('.cityList tr');
        cityListDiv.forEach(function(cityTable){
            // console.log(cityTable.querySelector("td").innerText);
            //省份,如果为空则为第一个城市：
            province = cityTable.querySelector("th").innerText.replace(/：/ig,"").trim();

            if(province.trim() =="\\t" || province.trim() =="") {
                province = cityTable.querySelector("a").innerText.replace(/：/ig,"").trim();
            }
            //省份下的城市
            citys=[];
            cityTable.querySelectorAll("a").forEach(function(city){
                citys.push({cn:city.innerText,link:city.getAttribute("href")});
            });
            cityMap[province]=citys;
        });
        return cityMap;
    });

    console.log(prAndCity);
    let writerStream = fs.createWriteStream('citys.txt');
    writerStream.write(JSON.stringify(prAndCity, undefined, 2), 'UTF8');
    writerStream.end();
    await browser.close();
})();