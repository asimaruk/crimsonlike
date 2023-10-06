export interface UsersRepository {
    readonly currentUser: UsersRepository.User | null;

    login(): Promise<UsersRepository.User>;
    logout(): void;
    updateUser(id: string, properties: Partial<Omit<UsersRepository.User, 'id'>>): void;
}

declare namespace UsersRepository {
    export type User = {
        id: string,
        name: string,
    };
}