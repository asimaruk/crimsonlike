import { _decorator, NodePool } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { PausableParticles } from '../effects/PausableParticles';
const { ccclass, menu } = _decorator;

@ccclass('DieLights')
@menu('Effects/DieLights')
export class DieLights extends GameComponent {

    private particles: PausableParticles;
    private pool: NodePool;
    private isInitialized = false;

    protected onLoad() {
        super.onLoad();
        this.init();
    }

    protected onPaused() {
        this.particles.paused = true;
    }

    protected onResumed() {
        this.particles.paused = false;
    }

    private init() {
        if (this.isInitialized) return;

        this.particles = this.getComponent(PausableParticles);
        this.isInitialized = true;
    }

    public reuse() {
        this.init();
        this.particles.resetSystem();
        this.scheduleOnce(
            () => this.pool.put(this.node),
            this.particles.duration + this.particles.life + this.particles.lifeVar
        );
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
    }
}

