export interface RecordsRepository {
    readonly records: RecordsRepository.Record[];
    refreshRecords(): Promise<RecordsRepository.Record[]>;
    postRecord(record: RecordsRepository.Record): Promise<RecordsRepository.NewRecord>;
}

declare namespace RecordsRepository {
    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = Omit<Record, 'name'> & {
        position: number
    };
}