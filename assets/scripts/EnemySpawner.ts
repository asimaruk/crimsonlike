import { _decorator, Component, Node, Prefab, CCInteger, UITransform, instantiate, random } from 'cc';
import { EnemyAI } from './EnemyAI';
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {

    @property({
        type: Node
    })
    player: Node;
    @property({
        type: Prefab
    })
    enemyPrefab: Prefab;
    @property({
        type: CCInteger
    })
    spawnIntervalSec = 10;
    @property({
        type: Node
    })
    ground: Node;

    private groundUITransform: UITransform;

    onLoad() {
        this.groundUITransform = this.ground.getComponent(UITransform);
    }

    start() {
        this.startSpawning();
    }

    startSpawning() {
        this.unschedule(this.spawn);
        this.schedule(this.spawn, this.spawnIntervalSec);
    }

    stopSpawning() {
        this.unschedule(this.spawn);
    }

    private spawn() {
        let newEnemy = instantiate(this.enemyPrefab);
        newEnemy.getComponent(EnemyAI).setDestination(this.player);
        let randomSide = random();
        let startX = 0;
        let startY = 0;
        if (randomSide > 0.5) {
            startX = this.groundUITransform.width * (random() - 0.5);
            startY = (this.groundUITransform.height * this.groundUITransform.anchorY + 100) * Math.sign(random() - 0.5);
        } else {
            startX = (this.groundUITransform.width * this.groundUITransform.anchorX + 100) * Math.sign(random() - 0.5);
            startY = this.groundUITransform.height * (random() - 0.5);
        }
        newEnemy.setPosition(startX, startY);
        this.node.addChild(newEnemy);
    }
}

