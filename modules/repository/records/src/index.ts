import { DefaultRecordsRepository } from "./DefaultRecordsRepository";
import { getRemoteRecords } from "records-data"
import { getHttpTransport } from 'transport-http-json-impl';
import { getAuthData } from 'auth-data';

export function createRecordsRepository() {
    return new DefaultRecordsRepository(getRemoteRecords(getHttpTransport(), getAuthData()));
}