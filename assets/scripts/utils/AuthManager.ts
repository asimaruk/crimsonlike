import { sys } from "cc";
import auth from 'auth-data';

export class AuthManager {

    private static _instance: AuthManager | null = null;
    public static get instance(): AuthManager {
        if (this._instance == null) {
            this._instance = new AuthManager();
        }
        return this._instance;
    }

    private _token: string | null;
    private _error: string | null;
    private authResolve: ((arg0: string) => void) | null = null;
    private authReject: ((arg0: string) => void) | null = null;
    private authPromise: Promise<string> | null = null;

    public get token(): string | null {
        return this._token;
    }

    public get error(): string | null {
        return this._error;
    }

    authorize(): Promise<string> {
        if (this._token) {
            return Promise.resolve(this._token);
        }

        if (this.authPromise != null) {
            return this.authPromise;
        }

        const promise = new Promise((resolve: (arg0: string) => void, reject) => {
            this.authResolve = resolve;
            this.authReject = reject;
        });
        this.authPromise = promise;

        if (sys.platform == sys.Platform.MOBILE_BROWSER || sys.platform == sys.Platform.DESKTOP_BROWSER) {
            window.googleAuthorize && window.googleAuthorize();
        }

        return promise;
    }

    resolveAuthorize(token: string) {
        console.log(token);
        this._token = token;
        auth.getAuthData()?.set({
            type: 'gg',
            token: token,
        });
        this.authResolve?.(token);
        this.authPromise = null;
    }

    rejectAuthorize(error: string) {
        console.error(error);
        this._error = error;
        this.authReject?.(error);
        this.authPromise = null;
    }

    logout() {
        this._token = null;
        this._error = null;
        this.authReject?.('logout');
        this.authPromise = null;
        auth.getAuthData()?.set(null);
    }
}

window.AuthManager = AuthManager;