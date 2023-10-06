export interface UsersData {
    login(): Promise<UsersData.User>;
    updateUser(id: string, properties: Partial<Omit<UsersData.User, 'id'>>): Promise<void>;
}

declare namespace UsersData {

    export type User = {
        id: string,
        name: string,
    };
}