import { _decorator, Component, Node, NodePool, random, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShotFlash')
export class ShotFlash extends Component {

    private pool: NodePool;

    load() {
        this.init();
    }

    private init() {
        let sprite = this.getComponent(Sprite);
        let frames = sprite.spriteAtlas.getSpriteFrames();
        sprite.spriteFrame = frames[Math.floor(frames.length * random())];
        this.scheduleOnce(() => {
            this.node.removeFromParent();
            this.pool.put(this.node);
        }, 0.1);
    }

    reuse() {
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
        this.init();
    }
}

