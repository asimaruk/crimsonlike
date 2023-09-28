import { Auth } from "auth-data-api";
import { DefaultAuthData } from "./DefaultAuthData";

let authData: Auth | null;

export function getAuthData(): Auth {
    if (authData == null) {
        authData = new DefaultAuthData();
    }
    return authData;
}