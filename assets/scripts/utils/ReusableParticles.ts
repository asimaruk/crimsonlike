import { _decorator, NodePool } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { PausableParticles } from '../effects/PausableParticles';
const { ccclass, menu, requireComponent } = _decorator;

@ccclass('ReusableParticles')
@menu('Utils/ReusableParticles')
@requireComponent(PausableParticles)
export class ReusableParticles extends GameComponent {

    private _particles: PausableParticles;
    private get particles(): PausableParticles {
        if (!this._particles) {
            this._particles = this.getComponent(PausableParticles);
        }
        return this._particles;
    }
    private pool: NodePool;

    protected onGamePause() {
        this.particles.paused = true;
    }

    protected onGameUnpause() {
        this.particles.paused = false;
    }

    public reuse() {
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

