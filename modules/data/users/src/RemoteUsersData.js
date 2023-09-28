"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteUsersData = void 0;
class RemoteUsersData {
    constructor(transport, authData) {
        this.transport = transport;
        this.authData = authData;
        this.currentUser = null;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.authData.get();
            if (token == null) {
                throw new Error('Can\'t login, auth data is null');
            }
            this.currentUser = yield this.transport.get('login');
            return this.currentUser;
        });
    }
}
exports.RemoteUsersData = RemoteUsersData;
