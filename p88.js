import axios from "axios";
import mongoose from "mongoose";
import fs from 'fs';

const connectMongo = async () => {
    try {
        await mongoose.connect("mongodb+srv://danh:hanhphucao@clusterblog.sbxju.mongodb.net/gamelist?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
            },
        )
        console.log("connected");
    } catch (error) {
        console.log(error);
    }
}

const getAxiosInstance = () => {
    return axios.create({});
}

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const crawl = async () => {
    const axiosInstance = getAxiosInstance();
    // while (true) {
    // await delay(20000);
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
        matchDetail['fullmatch'] = {
            "1X2": {
                "1": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][1] ? match[2][0][8]["0"][2][1] : null,
                "2": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][0] ? match[2][0][8]["0"][2][0] : null,
                "x": match[2][0][8]["0"] && match[2][0][8]["0"][2] && match[2][0][8]["0"][2][2] ? match[2][0][8]["0"][2][2] : null,
            },
            "hdp": [
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][0][0] && match[2][0][8]["0"][0][0][2] ? match[2][0][8]["0"][0][0][2] : null,
                    oddhome: match[2][0][8]["0"] && match[2][0][8]["0"][0][0] && match[2][0][8]["0"][0][0][3] ? match[2][0][8]["0"][0][0][3] : null,
                    oddaway: match[2][0][8]["0"] && match[2][0][8]["0"][0][0] && match[2][0][8]["0"][0][0][4] ? match[2][0][8]["0"][0][0][4] : null
                },
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][0][1] && match[2][0][8]["0"][0][1][2] ? match[2][0][8]["0"][0][1][2] : null,
                    oddhome: match[2][0][8]["0"] && match[2][0][8]["0"][0][1] && match[2][0][8]["0"][0][1][3] ? match[2][0][8]["0"][0][1][3] : null,
                    oddaway: match[2][0][8]["0"] && match[2][0][8]["0"][0][1] && match[2][0][8]["0"][0][1][4] ? match[2][0][8]["0"][0][1][4] : null
                },
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][0][2] && match[2][0][8]["0"][0][2][2] ? match[2][0][8]["0"][0][2][2] : null,
                    oddhome: match[2][0][8]["0"] && match[2][0][8]["0"][0][2] && match[2][0][8]["0"][0][2][3] ? match[2][0][8]["0"][0][2][3] : null,
                    oddaway: match[2][0][8]["0"] && match[2][0][8]["0"][0][2] && match[2][0][8]["0"][0][2][4] ? match[2][0][8]["0"][0][2][4] : null
                }
            ],
            "ou": [
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][1][0] && match[2][0][8]["0"][1][0][2] ? match[2][0][8]["0"][1][0][2] : null,
                    oddover: match[2][0][8]["0"] && match[2][0][8]["0"][1][0] && match[2][0][8]["0"][1][0][3] ? match[2][0][8]["0"][1][0][3] : null,
                    oddunder: match[2][0][8]["0"] && match[2][0][8]["0"][1][0] && match[2][0][8]["0"][1][0][4] ? match[2][0][8]["0"][1][0][4] : null
                },
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][1][1] && match[2][0][8]["0"][1][1][2] ? match[2][0][8]["0"][1][1][2] : null,
                    oddover: match[2][0][8]["0"] && match[2][0][8]["0"][1][1] && match[2][0][8]["0"][1][1][3] ? match[2][0][8]["0"][1][1][3] : null,
                    oddunder: match[2][0][8]["0"] && match[2][0][8]["0"][1][1] && match[2][0][8]["0"][1][1][4] ? match[2][0][8]["0"][1][1][4] : null
                },
                {
                    goal: match[2][0][8]["0"] && match[2][0][8]["0"][1][2] && match[2][0][8]["0"][1][2][2] ? match[2][0][8]["0"][1][2][2] : null,
                    oddover: match[2][0][8]["0"] && match[2][0][8]["0"][1][2] && match[2][0][8]["0"][1][2][3] ? match[2][0][8]["0"][1][2][3] : null,
                    oddunder: match[2][0][8]["0"] && match[2][0][8]["0"][1][2] && match[2][0][8]["0"][1][2][4] ? match[2][0][8]["0"][1][2][4] : null
                }
            ]
        }
        matchDetail['firstmatch'] = {
            "1X2": {
                "1": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][1] ? match[2][0][8]["1"][2][1] : null,
                "2": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][0] ? match[2][0][8]["1"][2][0] : null,
                "x": match[2][0][8]["1"] && match[2][0][8]["1"][2] && match[2][0][8]["1"][2][2] ? match[2][0][8]["1"][2][2] : null,
            },
            "hdp": [
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][0][0] && match[2][0][8]["1"][0][0][2] ? match[2][0][8]["1"][0][0][2] : null,
                    oddhome: match[2][0][8]["1"] && match[2][0][8]["1"][0][0] && match[2][0][8]["1"][0][0][3] ? match[2][0][8]["1"][0][0][3] : null,
                    oddaway: match[2][0][8]["1"] && match[2][0][8]["1"][0][0] && match[2][0][8]["1"][0][0][4] ? match[2][0][8]["1"][0][0][4] : null
                },
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][0][1] && match[2][0][8]["1"][0][1][2] ? match[2][0][8]["1"][0][1][2] : null,
                    oddhome: match[2][0][8]["1"] && match[2][0][8]["1"][0][1] && match[2][0][8]["1"][0][1][3] ? match[2][0][8]["1"][0][1][3] : null,
                    oddaway: match[2][0][8]["1"] && match[2][0][8]["1"][0][1] && match[2][0][8]["1"][0][1][4] ? match[2][0][8]["1"][0][1][4] : null
                },
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][0][2] && match[2][0][8]["1"][0][2][2] ? match[2][0][8]["1"][0][2][2] : null,
                    oddhome: match[2][0][8]["1"] && match[2][0][8]["1"][0][2] && match[2][0][8]["1"][0][2][3] ? match[2][0][8]["1"][0][2][3] : null,
                    oddaway: match[2][0][8]["1"] && match[2][0][8]["1"][0][2] && match[2][0][8]["1"][0][2][4] ? match[2][0][8]["1"][0][2][4] : null
                }
            ],
            "ou": [
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][1][0] && match[2][0][8]["1"][1][0][2] ? match[2][0][8]["1"][1][0][2] : null,
                    oddover: match[2][0][8]["1"] && match[2][0][8]["1"][1][0] && match[2][0][8]["1"][1][0][3] ? match[2][0][8]["1"][1][0][3] : null,
                    oddunder: match[2][0][8]["1"] && match[2][0][8]["1"][1][0] && match[2][0][8]["1"][1][0][4] ? match[2][0][8]["1"][1][0][4] : null
                },
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][1][1] && match[2][0][8]["1"][1][1][2] ? match[2][0][8]["1"][1][1][2] : null,
                    oddover: match[2][0][8]["1"] && match[2][0][8]["1"][1][1] && match[2][0][8]["1"][1][1][3] ? match[2][0][8]["1"][1][1][3] : null,
                    oddunder: match[2][0][8]["1"] && match[2][0][8]["1"][1][1] && match[2][0][8]["1"][1][1][4] ? match[2][0][8]["1"][1][1][4] : null
                },
                {
                    goal: match[2][0][8]["1"] && match[2][0][8]["1"][1][2] && match[2][0][8]["1"][1][2][2] ? match[2][0][8]["1"][1][2][2] : null,
                    oddover: match[2][0][8]["1"] && match[2][0][8]["1"][1][2] && match[2][0][8]["1"][1][2][3] ? match[2][0][8]["1"][1][2][3] : null,
                    oddunder: match[2][0][8]["1"] && match[2][0][8]["1"][1][2] && match[2][0][8]["1"][1][2][4] ? match[2][0][8]["1"][1][2][4] : null
                }
            ]
        }
        totalMatch.push(matchDetail);
    });
    fs.writeFileSync('p88.json',JSON.stringify(totalMatch),'utf8');
    console.log('Done');
}

const runCrawl = async () => {
    try {
        await crawl();
    } catch (error) {
        console.log(error)
        // runCrawl();
    }
}

(async () => {
    runCrawl();
})();
