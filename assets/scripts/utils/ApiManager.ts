import { Component, Node, director } from "cc";
import { EDITOR } from "cc/env";
import { RecordsRepository } from "records-repository-api";
import recordsrepo from 'records-repository';

export class ApiManager extends Component {

    public static RECORDS = 'records';
    public static NEW_RECORD = 'new_record';
    private static _instance: ApiManager | null = null;
    
    static get instance(): ApiManager {
        if (this._instance == null) {
            const node = new Node();
            node.name = '__apiManager__'
            if (!EDITOR) {
                director.getScene().addChild(node);
                director.addPersistRootNode(node);
            }
            this._instance = node.addComponent(ApiManager)
        }
        return this._instance;
    }

    private recordsRepository: RecordsRepository = recordsrepo.createRecordsRepository();

    records(): RecordsRepository.Record[] {
        return this.recordsRepository.records;
    }

    async refreshRecords(): Promise<RecordsRepository.Record[]> {
        const records = await this.recordsRepository.refreshRecords();
        this.node.emit(ApiManager.RECORDS, records);
        return records;
    }

    async newRecord(record: RecordsRepository.Record): Promise<RecordsRepository.NewRecord> {
        const newRecord = await this.recordsRepository.postRecord(record);
        this.node.emit(ApiManager.NEW_RECORD, newRecord);
        return newRecord;
    }

    on(event: string, callback: Function) {
        this.node.on(event, callback);
    }

    off(event: string, callback: Function) {
        this.node.off(event, callback);
    }
}