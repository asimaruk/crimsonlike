import { _decorator, Button, Color, EditBox, Label, Node, Sprite } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { AuthManager } from '../utils/AuthManager';
import { ApiManager } from '../utils/ApiManager';
import { UsersRepository } from 'users-repository-api';
const { ccclass, property, menu } = _decorator;

@ccclass('ProfileMenuUI')
@menu('UI/ProfileMenu')
export class ProfileMenuUI extends GameComponent {

    private static ANONYMOUS = 'Anonymous';
    private static LOGIN = 'Login';
    private static LOGOUT = 'Logout';
    private static EDIT = 'Edit';
    private static SAVE = 'Save';

    @property({
        type: Node
    }) loadSpinner: Node;
    @property({
        type: Label
    }) error: Label;
    @property({
        type: EditBox
    }) nameEdit: EditBox;
    @property({
        type: Label
    }) maxScore: Label;
    @property({
        type: Button
    }) saveEdit: Button;
    @property({
        type: Button
    }) loginLogout: Button;

    private nameEditSprite: Sprite | null;
    private disabledColor = Color.fromHEX(new Color(), '#7D7D7D');
    private enabledColor = Color.WHITE.clone();

    protected onLoad(): void {
        this.nameEditSprite = this.nameEdit.getComponent(Sprite);
    }

    protected onEnable(): void {
        super.onEnable();
        this.nameEdit.enabled = false;
        if (this.nameEditSprite) {
            this.nameEditSprite.enabled = false;
        }
        ApiManager.instance.on(ApiManager.CURRENT_USER, this.onCurrentUser, this);
        this.onCurrentUser(ApiManager.instance.currentUser());
    }

    protected onDisable(): void {
        super.onDisable();
        ApiManager.instance.off(ApiManager.CURRENT_USER, this.onCurrentUser, this);
    }

    private edit() {
        this.nameEdit.enabled = true;
        this.nameEdit.focus();
        if (this.nameEditSprite) {
            this.nameEditSprite.enabled = true;
        }
    }

    private save() {
        this.nameEdit.enabled = false;
        if (this.nameEditSprite) {
            this.nameEditSprite.enabled = false;
        }
        const user = ApiManager.instance.currentUser();
        if (!user) {
            return;
        }
        ApiManager.instance.updateUser(
            user.id,
            {
                name: this.nameEdit.string,
            }
        )
    }

    private async login() {
        this.loginLogout.interactable = false;
        this.loginLogout.getComponentInChildren(Label)!.color = this.disabledColor;
        try {
            await AuthManager.instance.authorize();
            await ApiManager.instance.login();
        } catch (e) {

        }
    }

    private onCurrentUser(user: UsersRepository.CurrentUser | null) {
        if (user) {
            this.loginLogout.getComponentInChildren(Label)!.string = ProfileMenuUI.LOGOUT;
            this.saveEdit.interactable = true;
            this.saveEdit.getComponentInChildren(Label)!.color = this.enabledColor;
        } else {
            this.loginLogout.getComponentInChildren(Label)!.string = ProfileMenuUI.LOGIN;
            this.saveEdit.interactable = false;
            this.saveEdit.getComponentInChildren(Label)!.color = this.disabledColor;
        }
        this.nameEdit.string = user?.name ?? ProfileMenuUI.ANONYMOUS;
        this.maxScore.string = (user?.score ?? this.gm.maxScore).toString();
        this.loginLogout.interactable = true;
        this.loginLogout.getComponentInChildren(Label)!.color = this.enabledColor;
    }

    private logout() {
        AuthManager.instance.logout();
        ApiManager.instance.logout();
    }

    onLoginLogout() {
        if (ApiManager.instance.currentUser()) {
            this.logout();
        } else {
            this.login();
        }
    }

    onSaveEdit() {
        if (this.nameEdit.enabled) {
            this.save();
            this.saveEdit.getComponentInChildren(Label)!.string = ProfileMenuUI.EDIT;
        } else {
            this.edit();
            this.saveEdit.getComponentInChildren(Label)!.string = ProfileMenuUI.SAVE;
        }
    }
}

