import { _decorator, CCFloat } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends GameComponent {

    @property({
        type: CCFloat,
        min: 0,
        tooltip: "Gun cooldown is seconds"
    })
    frequency = 1;

    private isCoolingDown = false;

    public fire() {
        if (this.isCoolingDown) {
            return;
        }

        this.fireShot();
        this.isCoolingDown = true;
        this.scheduleOnce(() => this.isCoolingDown = false, this.frequency);
    }

    protected fireShot() {
        
    }
}

