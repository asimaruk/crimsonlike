export interface RecordsRepository {
    readonly records: RecordsRepository.Record[];
    refreshRecords(): Promise<RecordsRepository.Record[]>;
    postRecord(record: RecordsRepository.NewRecord): Promise<RecordsRepository.SingleRecord>;
}

declare namespace RecordsRepository {
    export type Record = {
        uid: string,
        name: string,
        score: number,
    };

    export type NewRecord = Omit<Record, 'name'>;

    export type SingleRecord = Omit<Record, 'name'> & {
        position: number
    };
}