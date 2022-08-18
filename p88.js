import axios from "axios";
import mongoose from "mongoose";
import fs from 'fs';
import { connectMongo, insertData } from "./mongdb.js";

const getAxiosInstance = () => {
    return axios.create({});
}

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const crawl = async () => {
    const axiosInstance = getAxiosInstance();
    await connectMongo();
    let isFirst = true;
    while (true) {
        if(!isFirst){
            await delay(20000);
        } else {
            isFirst = false;
        }
        const allListMatchApi = await axiosInstance.get(`https://www.p88.bet/sports-service/sv/compact/events?_g=0&btg=1&c=&cl=3&d=&ev=&g=&hle=false&inl=false&l=3&lg=&lv=&me=0&mk=1&more=false&o=1&ot=1&pa=0&pn=-1&sp=29&tm=0&v=0&wm=&locale=en_US&_=${new Date().getTime()}&withCredentials=true`)
        let listMergeMap = [];
        if (allListMatchApi.data.l && allListMatchApi.data.l[0][2].length >= 1) {
            listMergeMap = [...listMergeMap, ...allListMatchApi.data.l[0][2]];
        }
        if (allListMatchApi.data.n && allListMatchApi.data.n[0][2].length >= 1) {
            listMergeMap = [...listMergeMap, ...allListMatchApi.data.n[0][2]];
        }
        const totalMatch = [];
        listMergeMap.map(match => {
            const matchDetail = {};
            matchDetail['infomatch'] = {
                namehome: match[2][0][1],
                nameaway: match[2][0][2],
                score: match[2][0][9] ? `${match[2][0][9][0]} - ${match[2][0][9][1]}` : null,
                time: match[2][0][16] || match[2][0][15] ? `${match[2][0][16]}${match[2][0][15]}` : null
            }
            const hdp = [];
            const ou = [];
            if (match[2][0][8]["0"] && match[2][0][8]["0"][0]) {
                match[2][0][8]["0"][0].map(hdpValue => {
                    hdp.push({
                        goal: hdpValue[2],
                        oddhome: hdpValue[3],
                        oddaway: hdpValue[4]
                    })
                })
            }
            if (match[2][0][8]["0"] && match[2][0][8]["0"][1]) {
                match[2][0][8]["0"][1].map(hdpValue => {
                    ou.push({
                        goal: hdpValue[2],
                        oddhome: hdpValue[3],
                        oddaway: hdpValue[4]
                    })
                })
            }

            matchDetail['fullmatch'] = {
                "1X2": {
                    "1": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][0] ? match[2][0][8]["0"][2][0] : null,
                    "2": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][1] ? match[2][0][8]["0"][2][1] : null,
                    "x": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][2] ? match[2][0][8]["0"][2][2] : null,
                },
            }
            matchDetail['fullmatch']['hdp'] = hdp;
            matchDetail['fullmatch']['ou'] = ou;

            const hdpFirstMatch = [];
            const ouFirstMatch = [];

            if (match[2][0][8]["1"] && match[2][0][8]["1"][0]) {
                match[2][0][8]["1"][0].map(hdpValue => {
                    hdpFirstMatch.push({
                        goal: hdpValue[2],
                        oddhome: hdpValue[3],
                        oddaway: hdpValue[4]
                    })
                })
            }
            if (match[2][0][8]["1"] && match[2][0][8]["1"][1]) {
                match[2][0][8]["1"][1].map(hdpValue => {
                    ouFirstMatch.push({
                        goal: hdpValue[2],
                        oddhome: hdpValue[3],
                        oddaway: hdpValue[4]
                    })
                })
            }

            matchDetail['firstmatch'] = {
                "1X2": {
                    "1": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][1] ? match[2][0][8]["1"][2][1] : null,
                    "2": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][0] ? match[2][0][8]["1"][2][0] : null,
                    "x": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][2] ? match[2][0][8]["1"][2][2] : null,
                },
            }

            matchDetail['firstmatch']['hdp'] = hdpFirstMatch;
            matchDetail['firstmatch']['ou'] = ouFirstMatch;

            totalMatch.push(matchDetail);
        });
        await insertData(totalMatch);
        console.log('done');
    }
}

const runCrawl = async () => {
    try {
        await crawl();
    } catch (error) {
        console.log(error)
        runCrawl();
    }
}

(async () => {
    runCrawl();
})();
