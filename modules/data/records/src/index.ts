import { RecordsData } from "records-data-api";
import { RemoteRecordsData } from "./RemoteRecordsData";

export function createRemoteRecords(
    protocol: 'http' | 'https' = 'http',
    host: string = 'localhost',
    port: number = 3000
): RecordsData {
    return new RemoteRecordsData(protocol, host, port);
}