import { _decorator, Component, tween, v3, random, UIOpacity, NodePool } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('BloodSplash')
@requireComponent(UIOpacity)
export class BloodSplash extends Component {

    private uiOpacity: UIOpacity;
    private pool: NodePool;

    onLoad() {
        this.init();
    }

    private init() {
        this.uiOpacity = this.getComponent(UIOpacity);
        this.node.setScale(0, 0, 0);
        this.node.setRotationFromEuler(v3(0, 0, 360 * random()));
        this.uiOpacity.opacity = 255;
        
        tween(this.node)
            .to(0.3, { scale: v3(1, 1, 0) }, { easing: 'quadIn' })
            .start();

        tween(this.uiOpacity)
            .delay(10)
            .to(0.5, { opacity: 0 })
            .call(() => this.pool.put(this.node))
            .start();
    }

    reuse() {
        this.init();
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
    }
}

