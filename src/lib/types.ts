// TODO: learn how to use app.d.ts (if applicable)

export interface SongEntry {
    id: number;
    // alpha-numeric title (TBD)
    title_alphanum?: string;
    // original title
    title: string;
    // "sub title"
    title_sub?: string;
    artist: string;
    artist_sub?: string;
};
