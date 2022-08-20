import * as cheerio from "cheerio";
import fs from 'fs';

const $ = cheerio.load(fs.readFileSync('./data.html'), null, false);
const filterDataLive = [];
const filterDataToday = [];
//live 
$('#odds-display-live .content-table tbody').map((i, el) => {
    if ($(el).attr('class') !== undefined && $(el).attr('class') !== 'more-block') {
        filterDataLive.push(el);
    }
});
//today
$('#odds-display-nonlive .content-table tbody').map((i, el) => {
    if ($(el).attr('class') !== undefined && $(el).attr('class') !== 'more-block') {
        filterDataToday.push(el);
    }
});

const allMatch = [];
let row = 1;

filterDataLive.map((el, index) => {
    if ($(el).attr('class').indexOf(' subrow') == -1) {
        let object = {
            isLive: true
        };
        object[`row-0`] = el;
        allMatch.push(object);
        row = 1;
    }

    if ($(el).attr('class').indexOf(' subrow') != -1) {
        allMatch[allMatch.length - 1][`row-${row}`] = el;
        row++;
    }
})

filterDataToday.map((el, index) => {
    if ($(el).attr('class').indexOf(' subrow') == -1) {
        let object = {
            isLive: false
        };
        object[`row-0`] = el;
        allMatch.push(object);
        row = 1;
    }

    if ($(el).attr('class').indexOf(' subrow') != -1) {
        allMatch[allMatch.length - 1][`row-${row}`] = el;
        row++;
    }
})

const allMatchInfo = [];

allMatch.map(el => {
    const matchInfo = {};
    matchInfo['infomatch'] = {};
    matchInfo['fullmatch'] = {};
    matchInfo['firstmatch'] = {};
    matchInfo['fullmatch']['hdp'] = [];
    matchInfo['fullmatch']['ou'] = [];
    matchInfo['firstmatch']['hdp'] = [];
    matchInfo['firstmatch']['ou'] = [];

    Object.entries(el).forEach(([key, value]) => {
        if (key === 'row-0') {
            //info match
            const nameOfTwoTeam = $(cheerio.load($(value).html(), null, false)('.team-name-column span'));
            const score = $(cheerio.load($(value).html(), null, false)('span.score'));
            const timeEl = $(cheerio.load($(value).html(), null, false)('.time-column-content .Red'));
            const nameHome = $(nameOfTwoTeam[0]).html().replace(/^\s+|\s+$/gm, '').replace("\n", " ");
            const nameAway = $(nameOfTwoTeam[1]).html().replace("\n", '<br/>');
            const scoreText = $(score).html() ? $(score).html().replace(/<span[^>]*>/g, "").replace(/<\/span[^>]*>/g, "").replace(":", "-") : null;
            const time = $(timeEl).html().replace(/^\s+|\s+$/gm, '').replace(/<span[^>]*>/g, "").replace(/<\/span[^>]*>/g, "").replace("\n", " ");

            matchInfo['infomatch']['namehome'] = nameHome;
            matchInfo['infomatch']['nameaway'] = nameAway;
            matchInfo['infomatch']['score'] = scoreText;
            matchInfo['infomatch']['time'] = time;

            if (el['isLive'] == true) {
                // 1X2
                get1X2Live(value, matchInfo);

                //hdp and ou full match
                let hdpPointHomeEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BLN"]'));
                let hdpPointAwayEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BLN BTN"]'));

                handleGetHdpAndOuLive(hdpPointHomeEl, hdpPointAwayEl, matchInfo);
            } else {
                get1X2Today(value, matchInfo);

                let hdpPointHomeEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN"]'));
                let hdpPointAwayEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BTN"]'));
                
                handleGetHdpAndOuToday(hdpPointHomeEl, hdpPointAwayEl, matchInfo);
            }
        } else if (key !== 'isLive'){
            if (el['isLive'] == true) {
                let hdpPointHomeEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BLN"]'));
                let hdpPointAwayEl = $(cheerio.load($(value).html(), null, false)('td[class=" BRN BLN BTN BBN"]'));

                handleGetHdpAndOuLive(hdpPointHomeEl, hdpPointAwayEl, matchInfo);
            } else {
                let hdpPointHomeEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN"]'));
                let hdpPointAwayEl = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BTN"]'));
                
                handleGetHdpAndOuToday(hdpPointHomeEl, hdpPointAwayEl, matchInfo);
            }
        }
    });
    allMatchInfo.push(matchInfo);
});

fs.writeFileSync('test.json', JSON.stringify(allMatchInfo), 'utf8');

// console.log($(cheerio.load($(allMatch[0]['row-1']).html(), null, false)('td[class=" BRN BLN BTN BBN"]')).html())

function handleGetHdpAndOuToday(hdpPointHomeEl, hdpPointAwayEl, matchInfo) {
    if (hdpPointHomeEl.html() && hdpPointAwayEl.html()) {
        let hdpPoint = null;
        if ($(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html() && $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html() != '&nbsp;') {
            hdpPoint = $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html();
        } else {
            hdpPoint = $(cheerio.load($(hdpPointAwayEl).html(), null, false)('.hdp-point')).html();
        }
        const hdpPointHome = $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(hdpPointAwayEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['fullmatch']['hdp'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            });
        }
    }

    const ouPointHomeEl = hdpPointHomeEl.next();
    const ouointAwayEl = hdpPointAwayEl.next();

    if (ouPointHomeEl.html() && ouointAwayEl.html()) {
        const hdpPoint = $(cheerio.load($(ouPointHomeEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(ouointAwayEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(ouPointHomeEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(ouointAwayEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['fullmatch']['ou'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }

    //hdp and ou first half
    const hdpPointHomeFirstHalfEl = hdpPointHomeEl.next().next().next().next();
    const hdpPointAwayFirstHalfEl = hdpPointAwayEl.next().next().next().next();

    if (hdpPointHomeFirstHalfEl.html() && hdpPointAwayFirstHalfEl.html()) {
        const hdpPoint = $(cheerio.load($(hdpPointHomeFirstHalfEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(hdpPointAwayFirstHalfEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(hdpPointHomeFirstHalfEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(hdpPointAwayFirstHalfEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['firstmatch']['hdp'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }

    const ouPointHomeFirstHalfEl = hdpPointHomeEl.next().next().next().next().next();
    const ouPointAwayFirstHalfEl = hdpPointAwayEl.next().next().next().next().next();

    if (ouPointHomeFirstHalfEl.html() && ouPointAwayFirstHalfEl.html()) {
        const hdpPoint = $(cheerio.load($(ouPointHomeFirstHalfEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(ouPointAwayFirstHalfEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(ouPointHomeFirstHalfEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(ouPointAwayFirstHalfEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['firstmatch']['ou'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }
}

function handleGetHdpAndOuLive(hdpPointHomeEl, hdpPointAwayEl, matchInfo) {
    if (hdpPointHomeEl.html() && hdpPointAwayEl.html()) {
        let hdpPoint = null;
        if ($(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html() && $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html() != '&nbsp;') {
            hdpPoint = $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.hdp-point')).html();
        } else {
            hdpPoint = $(cheerio.load($(hdpPointAwayEl).html(), null, false)('.hdp-point')).html();
        }
        const hdpPointHome = $(cheerio.load($(hdpPointHomeEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(hdpPointAwayEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['fullmatch']['hdp'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            });
        }
    }

    const ouPointHomeEl = hdpPointHomeEl.next();
    const ouointAwayEl = hdpPointAwayEl.next();

    if (ouPointHomeEl.html() && ouointAwayEl.html()) {
        const hdpPoint = $(cheerio.load($(ouPointHomeEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(ouointAwayEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(ouPointHomeEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(ouointAwayEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['fullmatch']['ou'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }

    //hdp and ou first half
    const hdpPointHomeFirstHalfEl = hdpPointHomeEl.next().next().next();
    const hdpPointAwayFirstHalfEl = hdpPointAwayEl.next().next().next();

    if (hdpPointHomeFirstHalfEl.html() && hdpPointAwayFirstHalfEl.html()) {
        const hdpPoint = $(cheerio.load($(hdpPointHomeFirstHalfEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(hdpPointAwayFirstHalfEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(hdpPointHomeFirstHalfEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(hdpPointAwayFirstHalfEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['firstmatch']['hdp'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }

    const ouPointHomeFirstHalfEl = hdpPointHomeEl.next().next().next().next();
    const ouPointAwayFirstHalfEl = hdpPointAwayEl.next().next().next().next();

    if (ouPointHomeFirstHalfEl.html() && ouPointAwayFirstHalfEl.html()) {
        const hdpPoint = $(cheerio.load($(ouPointHomeFirstHalfEl).html(), null, false)('.hdp-point')).html() || $(cheerio.load($(ouPointAwayFirstHalfEl).html(), null, false)('.hdp-point')).html()
        const hdpPointHome = $(cheerio.load($(ouPointHomeFirstHalfEl).html(), null, false)('.odds')).html();
        const hdpPointAway = $(cheerio.load($(ouPointAwayFirstHalfEl).html(), null, false)('.odds')).html();
        if (hdpPoint && hdpPointHome && hdpPointAway) {
            matchInfo['firstmatch']['ou'].push({
                goal: hdpPoint,
                oddhome: hdpPointHome,
                oddaway: hdpPointAway
            })
        }
    }
}

function get1X2Live(value, matchInfo) {
    //1X2 full match and half match
    const X1El = $(cheerio.load($(value).html(), null, false)('td[class="BLN BBN"]'));
    const X2El = $(cheerio.load($(value).html(), null, false)('td[class="BBN BLN BTN"]'));
    const XXEl = $(cheerio.load($(value).html(), null, false)('td[class="BLN BTN"]'));

    const X1 = X1El.html() ? $(cheerio.load($(X1El).html(), null, false)('.odds')).html() : null;
    const X2 = X2El.html() ? $(cheerio.load($(X2El).html(), null, false)('.odds')).html() : null;
    const XX = XXEl.html() ? $(cheerio.load($(XXEl).html(), null, false)('.odds')).html() : null;

    matchInfo['fullmatch']['1X2'] = {
        1: X1,
        2: X2,
        X: XX
    }

    const X1ElFirstMatch = $(cheerio.load($(value).html(), null, false)('td[class="BLN BBN"]')).next().next().next();
    const X2ElFirstMatch = $(cheerio.load($(value).html(), null, false)('td[class="BBN BLN BTN"]')).next().next().next();
    const XXElFisrtMatch = $(cheerio.load($(value).html(), null, false)('td[class="BLN BTN"]')).next().next().next();

    const X1FirstMatch = X1ElFirstMatch.html() ? $(cheerio.load($(X1ElFirstMatch).html(), null, false)('.odds')).html() : null;
    const X2FirstMatch = X2ElFirstMatch.html() ? $(cheerio.load($(X2ElFirstMatch).html(), null, false)('.odds')).html() : null;
    const XXFirstMatch = XXElFisrtMatch.html() ? $(cheerio.load($(XXElFisrtMatch).html(), null, false)('.odds')).html() : null;

    matchInfo['firstmatch']['1X2'] = {
        1: X1FirstMatch,
        2: X2FirstMatch,
        X: XXFirstMatch
    }
}

function get1X2Today(value, matchInfo) {
    //1X2 full match and half match
    const X1El = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN"]')).next().next();
    const X2El = $(cheerio.load($(value).html(), null, false)('td[class="BBN BRN BTN"]')).next().next();
    const XXEl = $(cheerio.load($(value).html(), null, false)('td[class="BTN BRN"]')).next().next();

    const X1 = X1El.html() ? $(cheerio.load($(X1El).html(), null, false)('.odds')).html() : null;
    const X2 = X2El.html() ? $(cheerio.load($(X2El).html(), null, false)('.odds')).html() : null;
    const XX = XXEl.html() ? $(cheerio.load($(XXEl).html(), null, false)('.odds')).html() : null;

    matchInfo['fullmatch']['1X2'] = {
        1: X1,
        2: X2,
        X: XX
    }

    const X1ElFirstMatch = X1El.next().next().next().next();
    const X2ElFirstMatch = X2El.next().next().next().next();
    const XXElFisrtMatch = XXEl.next().next().next().next();

    const X1FirstMatch = X1ElFirstMatch.html() ? $(cheerio.load($(X1ElFirstMatch).html(), null, false)('.odds')).html() : null;
    const X2FirstMatch = X2ElFirstMatch.html() ? $(cheerio.load($(X2ElFirstMatch).html(), null, false)('.odds')).html() : null;
    const XXFirstMatch = XXElFisrtMatch.html() ? $(cheerio.load($(XXElFisrtMatch).html(), null, false)('.odds')).html() : null;

    matchInfo['firstmatch']['1X2'] = {
        1: X1FirstMatch,
        2: X2FirstMatch,
        X: XXFirstMatch
    }
}

//get name
// console.log($(cheerio.load($(filterData[0]).html(), null, false)('.team-name-column span')[0]).html());