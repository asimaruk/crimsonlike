export interface UsersData {
    login(): Promise<UsersData.User>;
    updateUser(uid: string, properties: Partial<Omit<UsersData.User, 'id'>>): Promise<void>;
}

declare namespace UsersData {

    export type User = {
        id: string,
        name: string,
    };
}