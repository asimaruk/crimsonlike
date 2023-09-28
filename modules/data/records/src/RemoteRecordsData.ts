import { RecordsData } from "records-data-api";
import { HttpTransport } from 'transport-http-api';
import { Auth } from 'auth-data-api'

export class RemoteRecordsData implements RecordsData {

    constructor(
        private transport: HttpTransport,
        private authData: Auth,
    ) {}

    getRecords(): Promise<RecordsData.Record[]> {
        return this.transport.get<RecordsData.Record[]>('records');
    }

    postRecord(record: RecordsData.NewRecord): Promise<RecordsData.NewRecordResult> {
        const auth = this.authData.get();
        if (auth == null) {
            throw new Error(`Can't post ${record}, auth data is null`);
        }
        return this.transport.post<RecordsData.NewRecordResult>('new_record', { ...auth, ...record});
    }
}