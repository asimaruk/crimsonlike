export interface RecordsData {
    getRecords(): Promise<RecordsData.Record[]>;
    postRecord(record: RecordsData.NewRecord): Promise<RecordsData.NewRecordResult>;
}

declare namespace RecordsData {

    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = {
        uid: string,
        score: number
    };

    export type NewRecordResult = NewRecord & {
        position: number
    };

    export type User = {
        id: string,
        name: string,
    };
}