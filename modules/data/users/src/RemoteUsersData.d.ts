import { UsersData } from 'users-api';
import { HttpTransport } from 'transport-http-api';
import { Auth } from 'auth-data-api';
export declare class RemoteUsersData implements UsersData {
    private transport;
    private authData;
    private currentUser;
    constructor(transport: HttpTransport, authData: Auth);
    login(): Promise<UsersData.User>;
}
