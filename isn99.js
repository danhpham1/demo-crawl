import axios from "axios";
import { parseStringPromise } from "xml2js";
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
    const userInfo = await axiosInstance.post('http://www.isn99.com/membersite-api/api/member/authenticate', {
        username:"IW8866",
        password:"Ao7xW3EEsm"
    });
    while (true) {
        // await delay(20000);
        if (userInfo.data && userInfo.data.success == true) {
            const listMatchLivePromise =  axiosInstance.get(`http://www.isn99.com/membersite-api/api/data/events/1/3/0/7/3?_=${new Date().getTime()}`,{ headers: { Authorization:  `Bearer ${userInfo.data.token}`} });
            const listMatchTodayPromise =  axiosInstance.get(`http://www.isn99.com/membersite-api/api/data/events/1/2/0/7/3?_=${new Date().getTime()}`,{ headers: { Authorization:  `Bearer ${userInfo.data.token}`} });
            const [listMatchLive, listMatchToday] = await Promise.allSettled([listMatchLivePromise, listMatchTodayPromise]);
            let totalListMatch = [];
            if(listMatchLive.status == 'fulfilled'){
                totalListMatch = [...totalListMatch, ...listMatchLive.value.data.schedule.leagues]
            }
            if(listMatchToday.status == 'fulfilled'){
                totalListMatch = [...totalListMatch, listMatchToday.value.data.schedule.leagues]
            }
            const listTransferDataMatch = totalListMatch.reduce((temp,leadgues) => {
                const matchOfleagues = [];
                leadgues.events?.map(match => {
                    const markets = match.markets.reduce((temp, market) => {
                        const transferLines = market.lines.reduce((temp, line) => {
                            const transferMarket = line.marketSelections.map(value => {
                                return {
                                    odds: value.odds,
                                    handicap: value.handicap,
                                    decimalOdds: value.decimalOdds
                                }
                            });
                            temp = [...temp, {marketSelections: transferMarket}];
                            return temp;
                        },[])
                        temp = [...temp, {
                            [`${market.name}`]: transferLines
                        }]
                        return temp;
                    },[])
                    matchOfleagues.push({
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                        score: match.score,
                        markets: markets
                    })
                })
                temp = [...temp, ...matchOfleagues];
                return temp;
            }, [])
            fs.writeFileSync('isn99.json', JSON.stringify(listTransferDataMatch),'utf8');
            console.log('done')
        }
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
