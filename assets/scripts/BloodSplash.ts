import { _decorator, Component, tween, v3, random, UIOpacity } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('BloodSplash')
@requireComponent(UIOpacity)
export class BloodSplash extends Component {

    private uiOpacity: UIOpacity;

    onLoad() {
        this.uiOpacity = this.getComponent(UIOpacity);
        this.node.setScale(0, 0, 0);
        this.node.setRotationFromEuler(v3(0, 0, 360 * random()));
        
        tween(this.node)
            .to(0.3, { scale: v3(1, 1, 0) }, { easing: 'quadIn' })
            .start();

        tween(this.uiOpacity)
            .delay(10)
            .to(0.5, { opacity: 0 })
            .call(() => this.node.destroy())
            .start();
    }
}

