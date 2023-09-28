"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersData = void 0;
const RemoteUsersData_1 = require("./RemoteUsersData");
let usersData = null;
function getUsersData(transport, authData) {
    if (usersData == null) {
        usersData = new RemoteUsersData_1.RemoteUsersData(transport, authData);
    }
    return usersData;
}
exports.getUsersData = getUsersData;
