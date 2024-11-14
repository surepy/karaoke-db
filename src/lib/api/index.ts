import * as type from "./types"

export const endpoint = "https://tjkaraokeapp-kr.tjmedia.co.kr/web_service/Service1.asmx";
export const url = "http://tjkaraokeapp-kr.tjmedia.co.kr/";
// this will be parsed clientside for "new songs!"
// unknown entries will be "(Update Needed)" I guess
export const updates = "http://real-song.tjmedia.co.kr/CON1/System%20Files/database/inf/TJListData.db";

// 
const WS_APP_VersionCheck = (param1:any, param2: any) => { return { VersionGubun:param1, VersionValue: param2 } };
export const AppVersionCheck = (appver:number) => WS_APP_VersionCheck("APP", appver);
export const KpopDBVerCheck = (version:string) => WS_APP_VersionCheck("SONG_KOR", version);
export const PopDBVerCheck = (version:string) => WS_APP_VersionCheck("SONG_POP", version);
export const EtcDBVerCheck = (version:string) => WS_APP_VersionCheck("SONG_ETC", version);

const WS_APP_VersionQuery = (param1:any, param2: any) => { return { songgubun:param1, songversion: param2 } };
export const KpopDBVerQuery = (version:string) => WS_APP_VersionQuery(type.TJSongType.Kpop, version);
export const PopDBVerQuery = (version:string) => WS_APP_VersionQuery(type.TJSongType.Pop, version);
export const EtcDBVerQuery = (version:string) => WS_APP_VersionQuery(type.TJSongType.Etc, version);