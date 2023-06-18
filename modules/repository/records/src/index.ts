import { DefaultRecordsRepository } from "./DefaultRecordsRepository";
import { createRemoteRecords } from "records-data"

export function createRecordsRepository() {
    return new DefaultRecordsRepository(createRemoteRecords());
}