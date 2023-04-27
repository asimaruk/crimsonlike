import { _decorator, Component, Node, NodePool, ParticleSystem2D } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('DieLights')
@menu('Effects/DieLights')
export class DieLights extends Component {

    private particles: ParticleSystem2D;
    private pool: NodePool;
    private isInitialized = false;

    protected onLoad(): void {
        this.init();
    }

    private init() {
        if (this.isInitialized) return;

        this.particles = this.getComponent(ParticleSystem2D);
        this.isInitialized = true;
    }

    protected update(dt: number): void {
        if (this.particles.stopped) {
            // this.pool.put(this.node);
        }
    }

    reuse() {
        this.init();
        this.particles.resetSystem();
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
    }
}

