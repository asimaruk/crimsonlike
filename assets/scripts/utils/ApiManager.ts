import { Component, Node, director } from "cc";
import { EDITOR } from "cc/env";
import { RecordsRepository } from "records-repository-api";
import { UsersRepository } from 'users-repository-api';
import recordsrepo from 'records-repository';
import usersrepo from 'users-repository';

export class ApiManager extends Component {

    public static RECORDS = 'records';
    public static NEW_RECORD = 'new_record';
    public static CURRENT_USER = 'user';
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
    private usersRepository: UsersRepository = usersrepo.createUsersRepository();

    records(): RecordsRepository.Record[] {
        return this.recordsRepository.records;
    }

    async refreshRecords(): Promise<RecordsRepository.Record[]> {
        const records = await this.recordsRepository.refreshRecords();
        this.node.emit(ApiManager.RECORDS, records);
        return records;
    }

    async newRecord(newRecord: RecordsRepository.NewRecord): Promise<RecordsRepository.SingleRecord> {
        const record = await this.recordsRepository.postRecord(newRecord);
        if (this.currentUser()?.id == record.uid) {
            this.usersRepository.updateCurrentUser({ score: record.score });
        }
        this.node.emit(ApiManager.NEW_RECORD, record);
        return record;
    }

    currentUser(): UsersRepository.CurrentUser | null {
        return this.usersRepository.currentUser;
    }

    async login(): Promise<UsersRepository.User> {
        const user = await this.usersRepository.login();
        this.node.emit(ApiManager.CURRENT_USER, user);
        return user;
    }

    async updateUser(id: string, properties: Partial<Omit<UsersRepository.User, 'id'>>) {
        await this.usersRepository.updateUser(id, properties);
        this.node.emit(ApiManager.CURRENT_USER, this.usersRepository.currentUser);
    }

    logout() {
        this.usersRepository.logout();
        this.node.emit(ApiManager.CURRENT_USER, null);
    }

    isLoggedIn(): boolean {
        return this.usersRepository.currentUser != null;
    }

    on(event: string, callback: Function, target?: unknown) {
        this.node.on(event, callback, target);
    }

    off(event: string, callback: Function, target?: unknown) {
        this.node.off(event, callback, target);
    }
}