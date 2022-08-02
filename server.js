const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    MAX_TIME_OUT = 999999999;
    try {
        const browser = await puppeteer.launch({
            devtools: true,
            headless: false,
            timeout: MAX_TIME_OUT
        });
        const page = await browser.newPage();
        await page.goto("https://hga030.com/",{
            timeout:MAX_TIME_OUT
        });

        await page.waitForNavigation({
            timeout:MAX_TIME_OUT
        })
        await page.waitForSelector("#usr",{
            timeout:MAX_TIME_OUT
        })
        await page.evaluate(() => {
            const usernameInput = document.querySelector("#usr");
            if (usernameInput) {
                usernameInput.value = 'd103fsinbet';
            }
            const passwordInput = document.querySelector("#pwd");
            if (passwordInput){
                passwordInput.value = 'Rrrr1111'
            }
            const loginBtn = document.querySelector('#btn_login');
            if (loginBtn){
                loginBtn.click();
            }
        });

        await page.waitForNavigation({
            timeout:MAX_TIME_OUT
        });
        page.waitForSelector("#C_no_btn",{timeout:MAX_TIME_OUT}).then(()=>{
            page.evaluate(() => {
                document.querySelector("#C_no_btn").click();
            })
        });
        await page.waitForSelector("#live_page", {timeout:MAX_TIME_OUT})
        await page.evaluate(() => {
            document.querySelector("#live_page").click();
        })
        await page.waitForNavigation();
        let breakLoop = true;
        let data = null
        while(breakLoop) {
            data = await page.evaluate(() => {
                let divshow = document.querySelector("#div_show") ? [...document.querySelector("#div_show").children] : [];
                let isLossData = false;
                if (divshow.length > 0)
                for (el of divshow) {
                    if ( !el.children || el.children.length === 0){
                        isLossData = true;
                    }
                };
                if (!isLossData && divshow.length > 0) {
                    divshow = divshow.filter(el => el.children.item(0).style.display !== 'none');
                    const strData = divshow.reduce((str,el) => {
                        str += el.innerHTML;
                        return str;
                    },"")
                    return JSON.stringify({
                        strData,
                        // arrElement: divshow
                    });
                }
                return null;
            });
            if (data) {
                const parseData = JSON.parse(data);
                fs.writeFileSync("data.html",parseData.strData);
                breakLoop = false;
            }
        }
    } catch (error) {
        console.log(error)
    }
})()


// (async () => {
//     try {
//         const browser = await puppeteer.launch({
//             devtools:true,
//             headless:false,
//             timeout:999999999,
//         });
    
//         const page = await browser.newPage();
//         await page.goto("http://www.colourhim.com/",{
//             timeout:999999999
//         });
//         await page.evaluate(() => {
//             const username = document.querySelector("#username");
//             if ( username ) {
//                 username.value = "cn16a1";
//             }
//             const password = document.querySelector("#password");
//             if ( password ){
//                 password.value = "Copyright1";
//             }
    
//             const btnLogin = document.querySelector(".account-right a")
//             if ( btnLogin ) {
//                 btnLogin.click();
//             }
//         });
//         await page.waitForNavigation({
//             timeout:999999999,
//         });    
//         await page.evaluate(() => {
//             const btnBackHome = document.querySelector(".DWHomeBtn");
//             if ( btnBackHome ){
//                 btnBackHome.click();
//             }
//         });
//         await page.waitForNavigation({
//             timeout:999999999,
//         });
//         await page.waitForSelector("#row-live-0-0",{
//             timeout:999999999
//         })
//         await page.evaluate(() => {
//             console.log("work")
//             let flag = true;
//             while ( flag && document.querySelectorAll("#row-live-0-0") ){
//                 console.log("work:", document.querySelectorAll("#row-live-0-0"))
//                 if ( document.querySelectorAll("#row-live-0-0").length > 0 ){
//                     const point = [];
//                     document.querySelectorAll("#row-live-0-0 .dummy-class .black").forEach(el => { point.push(el.innerHTML) });
//                     const team = document.querySelectorAll("#row-live-0-0 .team-name-column span");
//                     console.log("------Team-------");
//                     team.forEach(el => {
//                         console.log(el.innerHTML);
//                     })
//                     console.log("-------Chỉ số------");
//                     console.log("Nguyên trận--------");
//                     console.log(`1: ${point[0]}`)
//                     console.log(`X: ${point[1]}`)
//                     console.log(`2: ${point[2]}`)
//                     console.log("-------------------");
//                     console.log("Hiệp 1-------------");
//                     console.log(`1: ${point[3]}`)
//                     console.log(`X: ${point[4]}`)
//                     console.log(`2: ${point[5]}`)
//                     flag = false;
//                 }
//             }
//         })
//     } catch (error) {
//         console.log(error)
//     }

// })()

