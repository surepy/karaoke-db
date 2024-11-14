// yes, this is fucking stupid.
// but i am unsure how to keep 100% offline compatibiltiy without doing this.
import type { SongEntry } from '$lib/types';
import Database from 'better-sqlite3';
import * as fs from 'node:fs/promises';
import { exit } from "node:process";

// database file to open and dump our js contents to
const dbFile = './static/TJSongData.db';

let songs:SongEntry[] = [];

// open our database
const db = new Database(dbFile);

// TODO: somehow determine "20 series or higher" songs
// we're throwing Title_Kor rows because my friends aren't using that :D


// c16Singer_Sub_Gubun = ?
// c11Singer_Kor is used as.. english??? what the fuck?
// koean
let kr_songs : any = await db.prepare("SELECT docid, c0Title, c2Title_Sub, c8Singer, c10Singer_Sub, c11Singer_Kor from TB_SongSearch_Kor_content").all();

let songs_count = 0;
songs_count += kr_songs.length;

// Q: WHY ARE YOU NOT USING FUNCTIONS? THIS IS DUPLICATED CODE
// A: the schema is different for each table (what the fuck, i know)
for (let kr_song of kr_songs) {
    songs.push (
        <SongEntry> {
            id: kr_song.docid,
            title: kr_song.c0Title,
            // NOTE: this column is used as METADATA (WHYYYYYY) a lot
            title_sub: kr_song.c2Title_Sub,
            artist: kr_song.c8Singer,
            artist_sub: kr_song.c10Singer_Sub
        }
    )
}

console.log(`imported ${kr_songs.length} songs from TB_SongSearch_Kor_content`);

// pop/jp
let pop_songs : any = await db.prepare("SELECT docid, c0Title, c2Title_Sub, c8Singer, c10Singer_Sub, c11Singer_Kor from TB_SongSearch_POPJPOP_content").all();
songs_count += pop_songs.length;

for (let pop_song of pop_songs) {
    songs.push (
        <SongEntry> {
            id: pop_song.docid,
            title: pop_song.c0Title,
            title_sub: pop_song.c2Title_Sub,
            artist: pop_song.c8Singer,
            artist_sub: pop_song.c10Singer_Sub
        }
    )
}

console.log(`imported ${pop_songs.length} songs from TB_SongSearch_POPJPOP_content`);

// "etc"
let etc_songs : any = await db.prepare("SELECT docid, c0Title, c2TitleENG, c5Singer from TB_SongSearch_ETC_content").all();
songs_count += etc_songs.length;

for (let etc_song of etc_songs) {
    songs.push (
        <SongEntry> {
            id: etc_song.docid,
            title: etc_song.c0Title,
            title_alphanum: etc_song.c2TitleENG,
            artist: etc_song.c5Singer
        }
    )
}

console.log(`imported ${etc_songs.length} songs from TB_SongSearch_ETC_content`);

await fs.writeFile("src/lib/songs.json", JSON.stringify(songs));

console.log(`loaded ${songs_count} songs total (${(await fs.stat("src/lib/songs.json")).size / 1000000} MB)`);