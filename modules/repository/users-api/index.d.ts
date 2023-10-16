export interface UsersRepository {
    readonly currentUser: UsersRepository.CurrentUser | null;

    login(): Promise<UsersRepository.CurrentUser>;
    logout(): void;
    updateUser(id: string, properties: Partial<Omit<UsersRepository.User, 'id'>>): void;
    updateCurrentUser(properties: Partial<Omit<UsersRepository.CurrentUser, 'id'>>): void;
}

declare namespace UsersRepository {
    export type User = {
        id: string,
        name: string,
    };

    export type CurrentUser = User & {
        score: number
    };
}