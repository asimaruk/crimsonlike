import { _decorator, Component, Prefab, Node, NodePool, instantiate } from 'cc';
import { ReusableParticles } from '../utils/ReusableParticles';
const { ccclass, property, menu } = _decorator;

@ccclass('EffectsManager')
@menu('Effects/EffectsManager')
export class EffectsManager extends Component {

    private static readonly FUME_POOL_SIZE = 10;
    private static readonly DIE_LIGHTS_POOL_SIZE = 10;

    @property({
        type: Prefab
    }) fume: Prefab;
    @property({
        type: Prefab
    }) dieLights: Prefab;

    private readonly fumePool = new NodePool(ReusableParticles.name);
    private readonly dieLightsPool = new NodePool(ReusableParticles.name);

    protected onLoad() {
        for (let i = 0; i < EffectsManager.FUME_POOL_SIZE; i++) {
            this.fumePool.put(instantiate(this.fume));
        }
        for (let i = 0; i < EffectsManager.DIE_LIGHTS_POOL_SIZE; i++) {
            this.dieLightsPool.put(instantiate(this.dieLights));
        }
    }

    public getBloodSplash(): Node {
        if (this.fumePool.size() <= 0) {
            this.fumePool.put(instantiate(this.fume));
        }
        return this.fumePool.get(this.fumePool);
    }

    public getDieLights(): Node {
        if (this.dieLightsPool.size() <= 0) {
            this.dieLightsPool.put(instantiate(this.dieLights));
        }
        return this.dieLightsPool.get(this.dieLightsPool);
    }
}

