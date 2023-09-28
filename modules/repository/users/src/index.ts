import { getHttpTransport } from "transport-http-json-impl";
import { getUsersData } from 'users-data';
import { DefaultUsersRepository } from "./DefaultUsersRepository";
import { getAuthData } from "auth-data";

export function createUsersRepository() {
    return new DefaultUsersRepository(getUsersData(getHttpTransport(), getAuthData()));
}