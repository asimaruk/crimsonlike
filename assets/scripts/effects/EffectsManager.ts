import { _decorator, Component, Prefab, Node, NodePool, instantiate } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('EffectsManager')
@menu('Effects/EffectsManager')
export class EffectsManager extends Component {

    private static readonly BLOOD_POOL_SIZE = 10;
    private static readonly DIE_LIGHTS_POOL_SIZE = 10;

    @property({
        type: Prefab
    }) bloodPrefab: Prefab;
    @property({
        type: Prefab
    }) dieLights: Prefab;

    private readonly bloodSlashPool = new NodePool('BloodSplash');
    private readonly dieLightsPool = new NodePool('DieLights');

    onLoad() {
        for (let i = 0; i < EffectsManager.BLOOD_POOL_SIZE; i++) {
            this.bloodSlashPool.put(instantiate(this.bloodPrefab));
        }
        for (let i = 0; i < EffectsManager.BLOOD_POOL_SIZE; i++) {
            this.dieLightsPool.put(instantiate(this.dieLights));
        }
    }

    getBloodSplash(): Node {
        if (this.bloodSlashPool.size() <= 0) {
            this.bloodSlashPool.put(instantiate(this.bloodPrefab));
        }
        return this.bloodSlashPool.get(this.bloodSlashPool);
    }

    getDieLights(): Node {
        if (this.dieLightsPool.size() <= 0) {
            this.dieLightsPool.put(instantiate(this.dieLights));
        }
        return this.dieLightsPool.get(this.dieLightsPool);
    }

    getEffect(name: string): Node | null {
        switch (name) {
            case 'BloodSplash': return this.getBloodSplash();
            case 'DieLights': return this.getDieLights();
            default: return null;
        }
    }
}

