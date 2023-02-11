import { 
    _decorator, 
    Prefab, 
    instantiate, 
    Sprite, 
    random, 
    v3, 
    Graphics, 
    Vec3, 
    CCInteger,
    PolygonCollider2D,
    Collider2D,
    IPhysics2DContact,
    Contact2DType,
} from 'cc';
import { Agent } from '../Agent';
import { Gun } from './Gun';
const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('Pistol')
@menu('Guns/Pistol')
@requireComponent(PolygonCollider2D)
export class Pistol extends Gun {

    @property({
        type: Prefab
    })
    gunfire: Prefab;
    @property({
        type: CCInteger,
        min: 0
    })
    range = 1000
    @property({
        type: CCInteger,
        min: 0
    })
    damage = 20

    private debugGraphics: Graphics;
    private fireDirection0 = v3();
    private fireDirection = v3();
    private collider: PolygonCollider2D;

    onLoad() {
        this.debugGraphics = this.addComponent(Graphics);
        this.debugGraphics.onLoad();
        this.collider = this.getComponent(PolygonCollider2D);
        this.collider.points[1].x = this.range;

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDestroy() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    fire() {
        let fire = instantiate(this.gunfire);
        let sprite = fire.getComponent(Sprite);
        let frames = sprite.spriteAtlas.getSpriteFrames();
        sprite.spriteFrame = frames[Math.floor(frames.length * random())];
        this.scheduleOnce(() => {
            fire.destroy();
        }, 0.1);
        this.node.addChild(fire);

        this.fireDirection0.set(Vec3.ZERO);
        this.fireDirection.set(Vec3.UNIT_X).multiplyScalar(this.range);

        this.collider.enabled = true;
        this.scheduleOnce(() => this.collider.enabled = false);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log(`Gun contact begin! ${contact}`);
        let agent = otherCollider.getComponent(Agent);
        if (agent) {
            // let contactPoint = contact?.getWorldManifold().points[0];
            agent.takeBullet(this.damage, 0, 0);
        }
    }
}

