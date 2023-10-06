import { UsersData } from 'users-api';
import { UsersRepository } from 'users-repository-api';

export class DefaultUsersRepository implements UsersRepository {

    private _currentUser: UsersRepository.User | null = null;

    get currentUser(): UsersRepository.User | null {
        return this._currentUser;
    }

    constructor(
        private usersData: UsersData
    ) {}

    async login(): Promise<UsersRepository.User> {
        if (this._currentUser != null) {
            return this._currentUser;
        }
        const userData = await this.usersData.login();
        return {
            id: userData.id,
            name: userData.name
        };
    }

    logout(): void {
        this._currentUser = null;
    }

    async updateUser(id: string, properties: Partial<Omit<UsersRepository.User, 'id'>>) {
        if (!this._currentUser) {
            return;
        }
        await this.usersData.updateUser(id, properties);
        Object.assign(this._currentUser, properties);
    }
}