import axios from "axios";
import { parseStringPromise } from "xml2js";
import mongoose from "mongoose";

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
    return axios.create({
        headers:{
            Accept: '*/*',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            Connection: 'keep-alive',
            'Content-type': 'application/x-www-form-urlencoded',
            Cookie: 'cu=N; myGameVer_27494428=_211228; box4pwd_notshow_27494428=27494428_N; ft_myGame_27494428={}; protocolstr=https; test=init; login_27494428=1658940233',
            Origin: 'https://hga030.com',
            Referer: 'https://hga030.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'sec-ch-ua': '.Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "Windows"
        }
    });
}

const getBodyParamsLogin = () => {
    const params = new URLSearchParams();
    params.append('p','chk_login');
    params.append('langx', 'en-us');
    params.append('ver', '_EN1-3ed5-SP-0721-94881ae5576be7');
    params.append('username', 'd103fsinbet');
    params.append('password', 'Rrrr1111');
    params.append('app', 'N');
    params.append('auto', 'GHAAAH');
    params.append('blackbox', '0400Drd90QCb/afjK9GFecOQiweGEW582cbd90ie3rB9AZFLWyLem5srwL2MfVfgZPH0PF0DiN@Qz3zkga/jfYSI3WIPArjDreTCT43R5j@o8w716badEhz4ils5t4pThhe39QmIvkwaq97dBuJUUgiyRxDHbHDck25@xYRQRCs0vzC3r1nJ2BxUbDwKSjGhVaEIY7aZ9gndN5mbotk2R8sdPGtGMuSZx2KTB4YRbnzZxt33SJ7esH0BkUtbIt6bmyvAvYx9V@Bk8fQ8XQOI35DPfOSBr@N9hIjdwKr0Mf@ogWb3WmfvVlSAmTM3fnDUMobOORkOi/3tA4ggrBH5xvykmUPKtcSzTI8WS84BiUUByp2B3yNMJqOdYvgzCSnDHfPc@t7NDEjD6p0f6jyURW4SOoKTnxJGRNajbdmjqhBdq@F43Zh8FbS6GAbgT1VOb7C0zxs8IQWbifl8ImtZZ0yXm8JcXncslqbvPVrR/Jyh6lskF8jqxe1axxVSy18fFlZ0mUD5xgKAFnn0HbKCUnEzFDMkfBVSkAveRduIP4dklrZme/hJzHwuC@vr1pHpgsfFgiFKOsXcSILjFijINS9@MWCtJpkmxKJc6zAm8p@G2PRgO962GbSLFVoE/iseBKWts0Jvt6oQ/ZKfFwblUmEpeM4hwN7eK4ojpKL6pKP30pqW/@e5dBdAa@khl3hOStUF0nLUeqD76HPxwUJvdekrQtebRcG2@TZFbazR87feXj4F7PqEEHOtLa6xraOOHRWf5NAePLsfleEscIcAZjcnSOkupWtJXOwjUsHozl@XYSgwQCgSK0S20VSjUNGRS08YY2MexdM4dvSRO@WoF0LXY@ZjVekMYG3JRgEqSehE5i27TsSmJARVzcw/Bn0hD@0LP8qFSAZ42orAdp/1/wwkJ37@7ToQ6j9QRif0QUxF@/FWC4Z0KPmWF5XdEHyeR2DF1@J2UeNkPrg4Q2BjiRVT3AHzj486sjgySgPiIcnlrVCbPrXOHMUHVya7F8LK3JhhyPCOzkJrb/AF2GKb28r9SxDlc5ibQ6opsC2ODMcwYCQtMuQQ3gvsR8jwjs5Ca2/wBdhim9vK/UsQ5XOYm0OqKbAtjgzHMGAkLTLkEN4L7EfI8I7OQmtv8AXYYpvbyv1LF/AoxxEih4nXclTHM8MKk74MjJ7vsy0enxQhLzE/XHOl2pKAmu1wlufgpbZuv5tFTzEBdNLiXsNC09gR/Q8fGTWAbv50krowBfyJjLLmO9JLh7h/QYTtLe2xNqKbzYmgq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O@yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTJMHcAjc@h84GLDM4fZkS@HhVKFtj4RUEN0wvpmFXnIR@huI6Fw40k82cGDz2TnqsW6E5T7SjbTt9nrw@qtcTdvYZu6nTy@ivJ90bKe4iYtsEMv5tsr1ng3OaALQ1Css2xIoQRH3eoZj4vH6bbk@Ffuey55rD9/B2ifipgDGdtWFM2Xsv62TRHHAw/O@Kufy3S600lapZBvAXvTmX93zVf3VY88LoOJ6louC/NXs1UZpa@8GxQj@MNhsvGs9UIXujquVntQW4I5Ds1eo4N@vexV2uPTrXYubxmuKU35dNy3d1HNka686rbGUHiYfxjJBgyzR7@@NeG1rnAAbwk6qCs151iinWjQhCbZeOpctbrnro@@jimOp2uTYyHrwuov/T2FKUEERZd5sXtDawKwi@ck6rztq4TdFbDI93jb0dzdfPiWN@xXx728aKZ36CMLYEs@MENuisBTGAQvwEuqpTTPNLWTqCMVq1VWzXFRBVAGKxOvk/lnDp3Tn/3HY2W3gG26RJ1YwCFKZTecNEiihq3KStlXouFciw0oR671r6APKaeTQzU2Cex/kNNTM75QsayrHbxcdMF@Gdf@5Gll1G2CUBCqr2e/gjMKKPw@/BsMch@w4Vq2PJC0O9@DXZe231gWRvfatDojMoSgaASA41NlO5fwYsUjy51FmrTyO8IkVu@jhTiJ8w3WFsoTBdfI2nHKUU9onjJidoJwUk4jclk/LEMokGoGJxIpJQceGZLcTSN32MJjYWVMQPcd6kSm4zXuCgYdAw6lBBKjH9L5C3f4O2t3jZ4ouSTTmqODftOo0hU4PR@8Is4UNYqtbkyp9emTpg6c2a2YRhuA@XGeonpXhuXX8ILrJAbCUZRVDRFDuZf2JrhJHFUwBozWfWMj3W8XtSCQA4UBtZhfC9n1qvn@z7bh4dyBmFTfJrUpTheoa8JA3m@I4t/b9NhAtl2HAmqHIJ8cqCLmqeQsIPjao0UYAovyFGH6xZN0t9BCI4a87XHFIJKYO8N0Bop5eCotTqvUsbq/N/mkqtgjZ9uYxUvv6gwRmYxkXpsyNqI@7Bae340mzQ9KZulVZpP@eKY53mX@u3@J7ff88rwahwsCHppSZB8WpPb6rwBn6UPppbpEwTUUKiUJjkQhITkCw8z2KH4guyMOakJjPkTAKm5OT4YTbg5IaDKYWbesyaZWdBxHJJ7Rrl00Uhlj07GXFlYxylQPtV3JU1S/SDWCjv9rOa76jsP69UzE03EKf/vOhKziXTIlvMiACm2mO@Tbcyp46EB2GDXcjpghmbPTnN5ES6v4kFWgZWJFZbGrNH7Y8CvDfpSeAjoyDntRE89JsBjY19/ucfGsuFBQv/Jp9uRMeisaVEWiXbOH2BPegm2xauZ6M3V7mp9Dm2Jg3pJong7D2@U3nDRIooatykrZV6LhXIsDOJ3n5q2sMj/fgWq4beK3xae97xsBqranm4ro/2bCtkvGIAIMxREwe0exIyJhjoEW3/w9/em/xRJIm/EQqlZFqqofreIYVvDefLPkkn/8k6twJyXpenLH4PdGgbvTHecTw7DBNc21dcZdqWgCI2Txw/qOb4lELBNYt/3nXohnnCi8HdHq@zH6WxjjVSaXxhq3KkaFSvVbdHL9U3UgeXwFwiJ9x6oNLcTVIbqOi@dRukhdcvlnHOceYH113uNGv4Tted@trm4ecPHI1bKbfTyUGaCnS7Jza@hQ==');
    params.append('userAgent', 'TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMy4wLjAuMCBTYWZhcmkvNTM3LjM2')
    return params;
}

const getBodyGameList = (uid) => {
    const params = new URLSearchParams();
    params.append('uid',uid),
    params.append('ver','_EN1-3ed5-SP-0721-94881ae5576be7');
    params.append('langx','en-us');
    params.append('p','get_game_list');
    params.append('p3type','');
    params.append('date','');
    params.append('gtype','ft');
    params.append('showtype','live');
    params.append('rtype','rb');
    params.append('ltype','4');
    params.append('sorttype','L');
    params.append('specialClick','');
    params.append('isFantasy','N');
    params.append('ts','1658940133939');
    return params;
}

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  } 

(async () => {
    const axiosInstance = getAxiosInstance();
    const paramsLogin = getBodyParamsLogin();
    try {
        await connectMongo();
        const gameListCollection = mongoose.connection.db.collection('gamelist');
        const userInfo = await axiosInstance.post('https://hga030.com/transform.php?ver=_EN1-3ed5-SP-0721-94881ae5576be7',paramsLogin);
        const userParseToJson = await parseStringPromise(userInfo.data,{trim:true,explicitArray:false});
        while(true){
            await delay(1000);
            if(userParseToJson && userParseToJson.serverresponse.status == 200){
                const uid = userParseToJson.serverresponse.uid;
                const paramsGameList = getBodyGameList(uid);
                const gameLists = await axiosInstance.post('https://hga030.com/transform.php?ver=_EN1-3ed5-SP-0721-94881ae5576be7', paramsGameList);
                const gameListToJson = await parseStringPromise(gameLists.data,{trim:true,explicitArray:false});
                const date = gameListToJson.serverresponse.system_time.split(" ")[0];
                const gameList = await gameListCollection.findOne({updatedAt: date});
                if( gameList ){
                    await gameListCollection.updateOne({updatedAt: date}, {$set:{data: gameListToJson.serverresponse.ec, timeVN: new Date()}},{upsert:true})
                } else {
                    await gameListCollection.insertOne({
                        data: gameListToJson.serverresponse.ec,
                        updatedAt: date,
                        timeVN: new Date()
                    });
                };
                console.log("Done");
            }
        }
    } catch (error) {
        console.log(error)
    }
})();
