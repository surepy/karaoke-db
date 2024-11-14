export enum TJSongType {
    Kpop = 1, // defined as gayo (not prononced gay o, but ga yo) internally
    Pop = 2, // this includes Jpop as jpop and Pop are in the same container
    Etc = 3 // chinese and more of SEA afik, haven't really checked
};
// TODO:
// private static final String VER_SONG_ETC = "SONG_ETC";
// private static final String VER_SONG_KOR = "SONG_KOR";
// private static final String VER_SONG_POP = "SONG_POP";

// check kr.tj.tjsmartplay_B.xmlparse.ReValComm.ReValCode
export enum ResponseCheckValue {
    No_Data = 2, // is 02
    Not_Good = 10, // also NOT_GOOD?
    No_Connect = 20, // what?
    Update_Required = 88, // defined as RESULT_UPDATE = "88";
    OK = 99
};

// every tj api reponds like this
export interface TJResponseType {
    RetChkVal: ResponseCheckValue,
    RetVal: any
}