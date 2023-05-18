import { _decorator } from 'cc';
import { Agent } from '../Agent';
import { HealthUI } from '../ui/HealthUI';
import { GameManager } from '../utils/GameManager';
import { AudioManager } from '../utils/AudioManager';
const { ccclass, menu, property } = _decorator;

@ccclass('Player')
@menu('Player/Player')
export class Player extends Agent {

    @property({
        type: HealthUI
    }) healthUI: HealthUI;

    private damageSounds = [
        AudioManager.Sounds.MELEE_HIT_1, 
        AudioManager.Sounds.MELEE_HIT_2, 
        AudioManager.Sounds.MELEE_HIT_3
    ];

    protected onLoad() {
        super.onLoad();
        this.healthUI.setHealth(this.fullHealth);
    }

    public onStep() {
        AudioManager.instance.playOneShot(AudioManager.Sounds.UI_CLICK, 0.1);
    }

    public onTakeDamage() {
        this.healthUI.setHealth(this.currentHealth);
        if (this.isAlive) {
            AudioManager.instance.playOneShot(this.damageSounds[Math.floor(Math.random() * this.damageSounds.length)]);
        }
    }

    protected onDie() {
        AudioManager.instance.playOneShot(AudioManager.Sounds.PLAYER_DEATH);
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
        AudioManager.instance.playOneShot(AudioManager.Sounds.PLAYER_RISE);
    }
}

