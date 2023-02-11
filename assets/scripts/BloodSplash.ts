import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('BloodSplash')
@requireComponent(Animation)
export class BloodSplash extends Component {

    private animation: Animation;

    onLoad() {
        this.animation = this.getComponent(Animation);
        this.animation.on(Animation.EventType.FINISHED, () => {
            this.node.destroy();
        }, this);
    }
}

