import { Auth } from 'auth-data-api'

export class DefaultAuthData implements Auth {

    private token: Auth.TokenData | null = null

    set(auth: Auth.TokenData | null): void {
        this.token = auth;
    }
    get(): Auth.TokenData | null {
        return this.token;
    }

}