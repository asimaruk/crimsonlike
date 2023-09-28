export interface UsersData {
    login(): Promise<UsersData.User>;
}

declare namespace UsersData {

    export type User = {
        id: string,
        name: string,
    };
}