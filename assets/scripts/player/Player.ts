import { _decorator } from 'cc';
import { Agent } from '../Agent';
import { HealthUI } from '../ui/HealthUI';
import { GameManager } from '../utils/GameManager';
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
        GameManager.instance.gameOver();
    }

    protected onGameReset() {
        this.healthUI.setHealth(this.fullHealth);
        this.currentHealth = this.fullHealth;
        this.rise();
    }

    protected onRise() {
        GameManager.instance.startGame();
    }
}

