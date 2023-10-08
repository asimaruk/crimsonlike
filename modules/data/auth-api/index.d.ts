export interface Auth {
    set(auth: Auth.TokenData | null): void;
    get(): Auth.TokenData | null;
}

declare namespace Auth {
    export type Type = 'gg';

    export type TokenData = {
        authType: Type,
        authToken: string
    };
}