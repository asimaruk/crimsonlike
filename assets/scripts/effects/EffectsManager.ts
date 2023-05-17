import { _decorator, Prefab, Node, NodePool, instantiate, resources } from 'cc';
import { ReusableParticles } from '../utils/ReusableParticles';

export class EffectsManager {

    private static _instance: EffectsManager;
    public static get instance(): EffectsManager {
        if (!EffectsManager._instance) {
            EffectsManager._instance = new EffectsManager();
        }
        return EffectsManager._instance;
    }

    private static readonly FUME_PREFAB = 'Fume';
    private static readonly DIE_LIGHTS_PREFAB = 'DieLights';
    private static readonly FUME_POOL_SIZE = 10;
    private static readonly DIE_LIGHTS_POOL_SIZE = 10;

    private readonly prefabs: { [key: string]: Prefab } = {}
    private readonly fumePool = new NodePool(ReusableParticles.name);
    private readonly dieLightsPool = new NodePool(ReusableParticles.name);
    private loaded: Promise<void>;

    constructor() {
        this.loaded = Promise.all([
            this.loadPrefab(EffectsManager.FUME_PREFAB),
            this.loadPrefab(EffectsManager.DIE_LIGHTS_PREFAB),
        ]).then(() => {
            for (let i = 0; i < EffectsManager.FUME_POOL_SIZE; i++) {
                this.fumePool.put(instantiate(this.prefabs[EffectsManager.FUME_PREFAB]));
            }
            for (let i = 0; i < EffectsManager.DIE_LIGHTS_POOL_SIZE; i++) {
                this.dieLightsPool.put(instantiate(this.prefabs[EffectsManager.DIE_LIGHTS_PREFAB]));
            }
        });
    }

    private loadPrefab(name: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(`prefabs/${name}`, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    this.prefabs[name] = prefab;
                    resolve(prefab);
                }
            });
        });
    }

    public load(): Promise<void> {
        return this.loaded;
    }

    public getFume(): Node {
        if (this.fumePool.size() <= 0) {
            this.fumePool.put(instantiate(this.prefabs[EffectsManager.FUME_PREFAB]));
        }
        return this.fumePool.get(this.fumePool);
    }

    public getDieLights(): Node {
        if (this.dieLightsPool.size() <= 0) {
            this.dieLightsPool.put(instantiate(this.prefabs[EffectsManager.DIE_LIGHTS_PREFAB]));
        }
        return this.dieLightsPool.get(this.dieLightsPool);
    }
}

