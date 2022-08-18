import axios from "axios";
import { parseStringPromise } from "xml2js";
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
    const userInfo = await axiosInstance.post('http://www.isn99.com/membersite-api/api/member/authenticate', {
        username: "IW8866",
        password: "Ao7xW3EEsm"
    });
    let isFirst = true;
    await connectMongo();
    while (true) {
        if(!isFirst){
            await delay(20000);
        } else {
            isFirst = false;
        }
        if (userInfo.data && userInfo.data.success == true) {
            const listMatchLivePromise = axiosInstance.get(`http://www.isn99.com/membersite-api/api/data/events/1/3/0/7/3?_=${new Date().getTime()}`, { headers: { Authorization: `Bearer ${userInfo.data.token}` } });
            const listMatchTodayPromise = axiosInstance.get(`http://www.isn99.com/membersite-api/api/data/events/1/2/0/7/3?_=${new Date().getTime()}`, { headers: { Authorization: `Bearer ${userInfo.data.token}` } });
            const [listMatchLive, listMatchToday] = await Promise.allSettled([listMatchLivePromise, listMatchTodayPromise]);
            let totalListMatch = [];
            if (listMatchLive.status == 'fulfilled') {
                totalListMatch = [...totalListMatch, ...listMatchLive.value.data.schedule.leagues]
            }
            if (listMatchToday.status == 'fulfilled') {
                totalListMatch = [...totalListMatch, ...listMatchToday.value.data.schedule.leagues]
            }
            const infoAllMatch = [];
            totalListMatch.map(league => {
                league.events.map(match => {
                    const infoMatch = {};
                    infoMatch['infomatch'] = {
                        namehome: match.homeTeam ? match.homeTeam : null,
                        nameaway: match.awayTeam ? match.awayTeam : null,
                        score: match.score ? match.score : null,
                        time: match.period ? match.period : null
                    }
                    infoMatch['fullmatch'] = {};

                    infoMatch['fullmatch']['1X2'] = {};
                    infoMatch['fullmatch']['hdp'] = [];
                    infoMatch['fullmatch']['ou'] = [];

                    infoMatch['firstmatch'] = {};
                    infoMatch['firstmatch']['1X2'] = {};
                    infoMatch['firstmatch']['hdp'] = [];
                    infoMatch['firstmatch']['ou'] = [];

                    match?.markets.map(market => {
                        if (market.name == '1x2') {
                            market.selections.map((selection) => {
                                if (selection.indicator == 'Home') {
                                    infoMatch['fullmatch']['1X2']['1'] = selection.odds
                                }
                                if (selection.indicator == 'Away') {
                                    infoMatch['fullmatch']['1X2']['2'] = selection.odds
                                }
                                if (selection.indicator == 'Draw') {
                                    infoMatch['fullmatch']['1X2']['X'] = selection.odds
                                }
                            })
                        }
                        if (market.name == 'HDP' || market.name == 'HT HDP') {
                            market.lines.map((line) => {
                                infoMatch['fullmatch']['hdp'].push({
                                    goal: line.marketSelections[0].handicap.replace(/[+\/*-]/g, ' ').replace(/ /g, ''),
                                    oddhome: line.marketSelections[0].odds,
                                    oddaway: line.marketSelections[1].odds
                                });
                            });
                        }
                        if (market.name == 'OU' || market.name == 'HT OU') {
                            market.lines.map((line) => {
                                infoMatch['fullmatch']['ou'].push({
                                    goal: line.marketSelections[0].handicap.replace(/[+\/*-]/g, ' ').replace(/ /g, ''),
                                    oddhome: line.marketSelections[0].odds,
                                    oddaway: line.marketSelections[1].odds
                                });
                            });
                        }
                        if (market.name == 'HT 1x2') {
                            market.selections.map((selection) => {
                                if (selection.indicator == 'Home') {
                                    infoMatch['firstmatch']['1X2']['1'] = selection.odds
                                }
                                if (selection.indicator == 'Away') {
                                    infoMatch['firstmatch']['1X2']['2'] = selection.odds
                                }
                                if (selection.indicator == 'Draw') {
                                    infoMatch['firstmatch']['1X2']['X'] = selection.odds
                                }
                            })
                        }
                    })
                    infoAllMatch.push(infoMatch);
                })
            })
            insertData(infoAllMatch);
            console.log("Done");
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
