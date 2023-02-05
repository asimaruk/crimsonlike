import { 
    _decorator, 
    Node, 
    Prefab, 
    instantiate, 
    Sprite, 
    random, 
    director, 
    v3, 
    Graphics, 
    Vec3, 
    UITransform, 
    CCInteger, 
} from 'cc';
import { EnemySpawner } from '../EnemySpawner';
import { Gun } from './Gun';
const { ccclass, property, menu } = _decorator;

@ccclass('Pistol')
@menu('Guns/Pistol')
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

    private enemies: Node;
    private debugGraphics: Graphics;
    private uiTransform: UITransform;
    private fireDirection0 = v3();
    private fireDirection = v3();

    onLoad() {
        let scene = director.getScene();
        this.enemies = scene.getComponentInChildren(EnemySpawner).node;
        this.debugGraphics = this.addComponent(Graphics);
        this.debugGraphics.onLoad();
        this.uiTransform = this.getComponent(UITransform);
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

        // this.debugGraphics.moveTo(this.fireDirection0.x, this.fireDirection0.y);
        // this.debugGraphics.lineTo(this.fireDirection.x, this.fireDirection.y);
        // this.debugGraphics.stroke();
    }
}

