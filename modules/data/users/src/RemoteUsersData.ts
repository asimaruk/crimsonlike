import { UsersData } from 'users-api';
import { HttpTransport } from 'transport-http-api';
import { Auth } from 'auth-data-api';

export class RemoteUsersData implements UsersData {

    private currentUser: UsersData.User | null = null;

    constructor(
        private transport: HttpTransport,
        private authData: Auth,
    ) {}

    async login(): Promise<UsersData.User> {
        const token = this.authData.get();
        if (token == null) {
            throw new Error('Can\'t login, auth data is null');
        }
        this.currentUser = await this.transport.get<UsersData.User>('login');
        return this.currentUser;
    }

    updateUser(id: string, properties: Partial<Omit<UsersData.User, 'id'>>): Promise<void> {
        const token = this.authData.get();
        if (token == null) {
            throw new Error('Can\'t login, auth data is null');
        }
        return this.transport.post<void>('updateUser', {
            ...token,
            id,
            ...properties,
        });
    }
}