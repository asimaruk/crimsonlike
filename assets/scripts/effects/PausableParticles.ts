import { _decorator, ParticleSystem2D } from 'cc';
const { ccclass, menu } = _decorator;

@ccclass('PausableParticles')
@menu('Effects/PausableParticles')
export class PausableParticles extends ParticleSystem2D {

    public paused = false;
    
    protected lateUpdate(dt: any) {
        // Steps for particles simulator called from lateUpdate().
        // So it's enough to skip it for 'pause' effect.
        if (this.paused) return;

        super.lateUpdate(dt);
    }
}

