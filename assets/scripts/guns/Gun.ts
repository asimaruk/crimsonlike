import { _decorator, Component, Node, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends Component {

    @property({
        type: CCFloat,
        min: 0,
        tooltip: "Gun cooldown is seconds"
    })
    frequency = 1;

    private isCoolingDown = false;

    fire() {
        if (this.isCoolingDown) {
            return;
        }

        this.fireShot();
        this.isCoolingDown = true;
        this.scheduleOnce(() => this.coolDown(), this.frequency);
    }

    fireShot() {

    }

    private coolDown() {
        this.isCoolingDown = false;
    }
}

