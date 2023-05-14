import { _decorator } from 'cc';
import { Agent } from '../Agent';
import { HealthUI } from '../ui/HealthUI';
const { ccclass, menu, property } = _decorator;

@ccclass('Player')
@menu('Player/Player')
export class Player extends Agent {

    @property({
        type: HealthUI
    }) healthUI: HealthUI;

    protected onLoad() {
        super.onLoad();
        this.healthUI.setHealth(this.fullHealth);
    }

    public onTakeDamage() {
        this.healthUI.setHealth(this.currentHealth);
    }

    protected wipeOut() {
        this.gm.gameOver();
    }
}

