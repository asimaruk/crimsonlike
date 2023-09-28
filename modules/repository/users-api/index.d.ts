export interface UsersRepository {
    readonly currentUser: UsersRepository.User | null;

    login(): Promise<UsersRepository.User>;
    logout(): void;
}

declare namespace UsersRepository {
    export type User = {
        id: string,
        name: string,
    };
}