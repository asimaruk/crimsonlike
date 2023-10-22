import { _decorator, Node, Prefab, CCInteger, UITransform, instantiate, random, NodePool, v3, CCFloat } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { Enemy } from './Enemy';
const { ccclass, property, menu } = _decorator;

@ccclass('EnemySpawner')
@menu('Enemies/EnemySpawner')
export class EnemySpawner extends GameComponent {

    private static INITIAL_SCALE = v3(0.8, 0.8, 0.8);

    @property({
        type: Node
    }) player: Node;
    @property({
        type: Prefab
    }) enemyPrefabs: Prefab[] = [];
    @property({
        type: CCInteger
    }) spawnIntervalSec = 10;
    @property({
        type: Node
    }) ground: Node;
    @property({
        type: CCInteger,
        min: 0,
    }) waveDuration = 50;
    @property({
        type: CCInteger,
        min: 0,
    }) waveTimeout = 10;
    @property({
        type: CCInteger,
        min: 1,
    }) startEnemyCount = 10;
    @property({
        type: CCFloat,
        min: 0,
    }) enemyWaveFactor = 0.3;
    @property({
        type: CCInteger,
        min: 0,
    }) startWave = 0;

    private groundUITransform: UITransform;
    private enemyPools: NodePool[];
    private waveTime: number = 0;
    private waveNumber: number = 0;
    private currentEnemyCount: number = 0;

    protected onLoad() {
        this.groundUITransform = this.ground.getComponent(UITransform)!;
    }

    protected onGameStart() {
        this.startEnemyWaves();
    }

    protected onGameOver() {
        this.stopEnemyWaves();
    }

    protected onGameReset() {
        this.stopEnemyWaves();
    }

    private startEnemyWaves() {
        this.waveNumber = this.startWave;
        this.nextWave();
    }

    private stopEnemyWaves() {
        this.unschedule(this.stepWave);
        this.unschedule(this.onWaveTimeout);
    }

    private nextWave() {
        this.waveTime = 0;
        this.currentEnemyCount = 0;
        const spawnsNumber = this.startEnemyCount + Math.floor(this.startEnemyCount * this.enemyWaveFactor * this.waveNumber);
        console.log(`Wave ${this.waveNumber}, spawns ${spawnsNumber}`);
        const spawnInterval = this.waveDuration / spawnsNumber;
        this.schedule(this.stepWave, spawnInterval, spawnsNumber, 0);
    }

    private stepWave(dt: number) {
        this.waveTime += dt;
        this.spawn();
    }

    private onEnemyRemoved() {
        this.currentEnemyCount--;
        if (this.waveTime >= this.waveDuration && this.currentEnemyCount == 0) {
            this.scheduleOnce(this.onWaveTimeout, this.waveTimeout);
        }
    }

    private onWaveTimeout() {
        this.waveNumber++;
        this.nextWave();
    }

    private spawn() {
        const enemyNode = this.getEnemyFromPool(Math.floor(random() * this.enemyPrefabs.length));
        const enemy = enemyNode.getComponent(Enemy);
        if (!enemy) {
            throw Error(`Enemy prefab ${enemyNode.name} doesn't have enemy component`)
        }
        enemy.setDestination(this.player);
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
        enemyNode.setPosition(startX, startY);
        enemyNode.setScale(EnemySpawner.INITIAL_SCALE);
        this.node.addChild(enemyNode);
        enemyNode.once(Node.EventType.PARENT_CHANGED, this.onEnemyRemoved, this);
        enemy.walk();
        this.currentEnemyCount++;
    }

    private getEnemyFromPool(index: number): Node {
        if (!this.enemyPools) {
            this.enemyPools = Array<NodePool>(this.enemyPrefabs.length).fill(new NodePool('Enemy'));
        }
        let enemyPool = this.enemyPools[index];
        if (enemyPool.size() <= 0) {
            let enemy = instantiate(this.enemyPrefabs[index]);
            console.log(`Create new enemy ${enemy.name}`);
            enemyPool.put(enemy);
        }

        const enemyNode = enemyPool.get(enemyPool);
        if (!enemyNode) {
            throw Error('Can\'t get enemy from pool');
        }
        return enemyNode;
    }
}

