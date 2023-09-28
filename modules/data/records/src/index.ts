import { RecordsData } from "records-data-api";
import { RemoteRecordsData } from "./RemoteRecordsData";
import { HttpTransport } from "transport-http-api";
import { Auth } from "auth-data-api";

let recordsData: RecordsData | null = null;

export function getRemoteRecords(transport: HttpTransport, authData: Auth): RecordsData {
    if (recordsData == null) {
        recordsData = new RemoteRecordsData(transport, authData);
    }
    return recordsData;
}