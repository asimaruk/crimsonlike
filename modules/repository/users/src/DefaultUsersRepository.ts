import { UsersData } from 'users-api';
import { UsersRepository } from 'users-repository-api';

export class DefaultUsersRepository implements UsersRepository {

    private _currentUser: UsersRepository.CurrentUser | null = null;

    get currentUser(): UsersRepository.CurrentUser | null {
        return this._currentUser;
    }

    constructor(
        private usersData: UsersData
    ) {}

    async login(): Promise<UsersRepository.CurrentUser> {
        if (this._currentUser != null) {
            return this._currentUser;
        }
        const userData = await this.usersData.login();
        const user = {
            id: userData.id,
            name: userData.name,
            score: userData.score,
        };
        this._currentUser = user;
        return user;
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

    updateCurrentUser(properties: Partial<Omit<UsersRepository.CurrentUser, 'id'>>): void {
        if (this._currentUser == null) {
            return;
        }

        Object.assign(this._currentUser, properties);
    }
}