/**
 * Updates Songs and puts them into a nice little sqlite DB
 * 
 * NOTE: this talks to Service1, We're not talking to Service2 as
 * we don't *really* have to use the storeowner api.
 * 
 * this is somewhat a replication of chkWebPVersion in the android appliation.
 * 
 * It's recommended to use a base data of _B (synced with _U, filename TJSongData.db)
 * with hash 2b15a637a776b82019308f28920056cb730dcebe376d3484e376c1e77ebc31b7
 * 
 * Note: you might want to run this a couple times if coming from the base data.
 */
import soap from "soap";
import Database from 'better-sqlite3';
import * as fs from 'node:fs/promises';
import { exit } from "node:process";
import { XMLParser } from "fast-xml-parser";
import { 
    AppVersionCheck, 
    endpoint, 
    EtcDBVerCheck, 
    EtcDBVerQuery, 
    KpopDBVerCheck, 
    KpopDBVerQuery, 
    PopDBVerCheck, 
    PopDBVerQuery
} from "./lib/api";
import * as api_t from "./lib/api/types";

// pull this off android:versionCode in _B application from
// androidmanifest.xml. check research.md
const APP_KNOWN_LATEST_VERSION = 69;
// kind of useless request
const DO_VERSIONCHECK = true;
// database file to update
const dbFile = './static/TJSongData.db';

try {
    await fs.access(dbFile, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
} catch {    
    console.log("[!] db file doesn't exist, exiting.");
    exit(1);
} 

// TODO: if this fails (and tjmedia disables the WSDL part) build the definitions ourselves.
// or alternatively embed the already-saved WSDL file 
let client = await soap.createClientAsync(`${endpoint}?WSDL`, { wsdl_options: { headers: { "Content-Type": "text/xml" }} });
// console.log(client.describe());

// a test request to see if this even works
// ver APP_KNOWN_LATEST_VERSION is the latest version of the _B app.
// versioncode is 100 on the normal app i dont know how it works
// nor do i care whatever it's not my job
// TODO: the request sending is lowk ugly, improve?
if (DO_VERSIONCHECK) {
    let versioncheck : api_t.TJResponseType = (await client.WS_APP_VersionCheckAsync(AppVersionCheck(APP_KNOWN_LATEST_VERSION)))[0].WS_APP_VersionCheckResult;

    if (versioncheck.RetChkVal != api_t.ResponseCheckValue.OK) {
        console.log(`[!] VersionCheck returned response code of ${versioncheck.RetChkVal} (value: ${versioncheck.RetVal})`);
    }
}

// open our database
const db = new Database(dbFile);

// these defaults are pulled from 2b15a637a776b82019308f28920056cb730dcebe376d3484e376c1e77ebc31b7's defaults.
let kpopLastPublishDate = '20190711';
let popLastPublishDate = '20190711';
let etcLastPublishDate = '20190708';

// pull all the last entry of publish date from all the databases
// maxpublishDT
let req : any = await db.prepare("SELECT c20PublishDate from TB_SongSearch_Kor_content ORDER BY c20PublishDate DESC LIMIT 1").get();
kpopLastPublishDate = req.c20PublishDate;

req = await db.prepare("SELECT c19PublishDate from TB_SongSearch_POPJPOP_content ORDER BY c19PublishDate DESC LIMIT 1").get();
popLastPublishDate = req.c19PublishDate;

req = await db.prepare("SELECT c13PublishDate from TB_SongSearch_ETC_content ORDER BY c13PublishDate DESC LIMIT 1").get();
etcLastPublishDate = req.c13PublishDate;

console.log(`Current kpop ${kpopLastPublishDate} / pop ${popLastPublishDate} / etc ${etcLastPublishDate}`);

// processes the update sql queries from tj servers.
// TODO: make it so it's possible to keep deleted data in a seperate table, and mark as "deleted"
const ProcessUpdateData = (strData:string) => {
    const parser = new XMLParser();
    const data = parser.parse(strData); 
    let setCounter = 0;

    for (let [key, value] of Object.entries(data.NewDataSet.Table1)) {
        console.log(`set ${setCounter}`);

        console.log(`action: ${key}`);
        //console.log(`value: ${value}`);

        // what could POSSIBLY go wrong
        db.exec(<string>value);
        // nothing ever wrong has happened from blindly executing
        // sql statements from the internet
        setCounter++;
    }
};

// start asking the server what the latest versions are, and update our local sqlite database
let kpopVer : api_t.TJResponseType = (await client.WS_APP_VersionCheckAsync(KpopDBVerCheck(kpopLastPublishDate)))[0].WS_APP_VersionCheckResult;
if (kpopVer.RetChkVal != api_t.ResponseCheckValue.OK) {
    console.log(`kpop ver mismatch, updating (latest: ${kpopVer.RetVal})`);
    
    let kpopUpdate : api_t.TJResponseType = (await client.WS_APP_VersionQueryAsync(KpopDBVerQuery(kpopLastPublishDate)))[0].WS_APP_VersionQueryResult;
    ProcessUpdateData(kpopUpdate.RetVal);
}
else {
    console.log(`kpop is up to date. (ver: ${kpopVer.RetVal})`);
}

let popVer : api_t.TJResponseType = (await client.WS_APP_VersionCheckAsync(PopDBVerCheck(popLastPublishDate)))[0].WS_APP_VersionCheckResult;
if (popVer.RetChkVal != api_t.ResponseCheckValue.OK) {
    console.log(`pop ver mismatch, updating (latest: ${popVer.RetVal})`);
    
    let popUpdate : api_t.TJResponseType = (await client.WS_APP_VersionQueryAsync(PopDBVerQuery(popLastPublishDate)))[0].WS_APP_VersionQueryResult;
    ProcessUpdateData(popUpdate.RetVal);
}
else {
    console.log(`pop is up to date. (ver: ${popVer.RetVal})`);
}

let etcVer : api_t.TJResponseType = (await client.WS_APP_VersionCheckAsync(EtcDBVerCheck(etcLastPublishDate)))[0].WS_APP_VersionCheckResult;
if (etcVer.RetChkVal != api_t.ResponseCheckValue.OK) {
    console.log(`etc ver mismatch, updating (latest: ${etcVer.RetVal})`);
    
    let etcUpdate : api_t.TJResponseType = (await client.WS_APP_VersionQueryAsync(EtcDBVerQuery(etcLastPublishDate)))[0].WS_APP_VersionQueryResult;
    ProcessUpdateData(etcUpdate.RetVal);
}
else {
    console.log(`etc is up to date. (ver: ${etcVer.RetVal})`);
}

// we're done.
console.log("Update finished");
console.log(`New Data: kpop ${kpopVer.RetVal} / pop ${popVer.RetVal} / etc ${etcVer.RetVal}`);