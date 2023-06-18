export interface RecordsData {
    getRecords(): Promise<RecordsData.Record[]>;
    postRecord(record: RecordsData.Record): Promise<RecordsData.NewRecord>;
}

declare namespace RecordsData {
    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = Record & {
        position: number
    };
}