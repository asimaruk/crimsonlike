import { _decorator, Color, NodePool, random, Sprite, Tween, tween, Vec3 } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('Projectile')
@menu('Guns/Projectile')
export class Projectile extends GameComponent {

    @property
    damage = 10;
    @property
    speed = 50;
    @property({
        type: Sprite
    })
    skin: Sprite;

    private pool: NodePool;

    public reuse() {
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
    }

    public fly(position: Vec3, direction: Vec3, distance: number) {
        this.node.setPosition(position);
        this.skin.color = Color.WHITE.clone();
        let time = distance / this.speed;
        tween(this.node)
            .to(time, {
                position: direction
            })
            .call(() => this.hit())
            .start();
        tween(this.skin)
            .delay(time - 0.2)
            .to(0.2, {
                color: Color.TRANSPARENT
            })
            .start();
        tween(this.skin.node)
            .by(0.7, { angle: Math.sign(random() - 0.5) * 360 })
            .repeatForever()
            .start();
    }

    public hit() {
        Tween.stopAllByTarget(this.node);
        Tween.stopAllByTarget(this.skin);
        Tween.stopAllByTarget(this.skin.node);
        this.pool.put(this.node);
    }

    protected getTweenTargets(): any[] {
        return [this.node, this.skin, this.skin.node]
    }
}

