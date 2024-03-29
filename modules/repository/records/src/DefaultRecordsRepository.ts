import { RecordsRepository } from 'records-repository-api'
import { RecordsData } from 'records-data-api'

export class DefaultRecordsRepository implements RecordsRepository {

    private _records: RecordsRepository.Record[] = [];

    get records(): RecordsRepository.Record[] {
        return this._records;
    }

    constructor(private recordsData: RecordsData) {

    }

    async refreshRecords(): Promise<RecordsRepository.Record[]> {
        const data = await this.recordsData.getRecords();
        const records = data.map((d) => {
            return {
                uid: d.uid,
                name: d.name,
                score: d.score,
            }
        });
        this._records = records;
        return records;
    }

    async postRecord(record: RecordsRepository.NewRecord): Promise<RecordsRepository.SingleRecord> {
        const newRec = await this.recordsData.postRecord({
            uid: record.uid,
            score: record.score,
        });
        return {
            uid: newRec.uid,
            score: newRec.score,
            position: newRec.position,
        };
    }

}