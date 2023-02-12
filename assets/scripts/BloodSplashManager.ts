import { _decorator, Component, Prefab, CCInteger, Node, NodePool, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BloodSplashManager')
export class BloodSplashManager extends Component {

    @property({
        type: Prefab
    }) bloodPrefab: Prefab;
    @property({
        type: CCInteger
    }) poolSize = 10;

    readonly pool = new NodePool('BloodSplash');

    onLoad() {
        for (let i = 0; i < this.poolSize; i++) {
            this.pool.put(instantiate(this.bloodPrefab));
        }
    }

    get(): Node | null {
        if (this.pool.size() <= 0) {
            this.pool.put(instantiate(this.bloodPrefab));
        }
        return this.pool.get(this.pool);
    }
}

