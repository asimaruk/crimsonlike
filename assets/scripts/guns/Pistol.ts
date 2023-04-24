import { 
    _decorator, 
    Prefab, 
    instantiate,
    v3, 
    Graphics, 
    Vec3, 
    CCInteger,
    PolygonCollider2D,
    Collider2D,
    Contact2DType,
    Node,
    NodePool,
} from 'cc';
import { Agent } from '../Agent';
import { Gun } from './Gun';
const { ccclass, property, menu } = _decorator;

@ccclass('Pistol')
@menu('Guns/Pistol')
export class Pistol extends Gun {

    @property({
        type: Node
    })
    fireSlot: Node;

    @property({
        type: Prefab
    })
    gunfire: Prefab;

    @property({
        type: CCInteger,
        min: 0
    })
    range = 1000;

    @property({
        type: CCInteger,
        min: 0
    })
    damage = 20;

    private debugGraphics: Graphics;
    private fireDirection0 = v3();
    private fireDirection = v3();
    private collider: PolygonCollider2D;
    private shotFlashPool = new NodePool('ShotFlash');

    onLoad() {
        this.debugGraphics = this.addComponent(Graphics);
        this.debugGraphics.onLoad();
        this.collider = this.fireSlot.getComponent(PolygonCollider2D);
        this.collider.points[1].x = this.range;

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDestroy() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    fireShot() {
        if (this.shotFlashPool.size() <= 0) {
            this.shotFlashPool.put(instantiate(this.gunfire));
        }
        this.fireSlot.addChild(this.shotFlashPool.get(this.shotFlashPool));

        this.fireDirection0.set(Vec3.ZERO);
        this.fireDirection.set(Vec3.UNIT_X).multiplyScalar(this.range);

        this.collider.enabled = true;
        this.scheduleOnce(() => this.collider.enabled = false);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        let agent = otherCollider.getComponent(Agent);
        if (agent) {
            agent.takeBullet(this.damage);
        }
    }
}

