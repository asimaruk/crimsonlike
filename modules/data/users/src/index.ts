import { Auth } from "auth-data-api";
import { HttpTransport } from "transport-http-api";
import { UsersData } from "users-api";
import { RemoteUsersData } from "./RemoteUsersData";

let usersData: UsersData | null = null;

export function getUsersData(transport: HttpTransport, authData: Auth) {
    if (usersData == null) {
        usersData = new RemoteUsersData(transport, authData);
    }
    return usersData;
}