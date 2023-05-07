import { _decorator, ParticleSystem2D } from 'cc';
const { ccclass } = _decorator;

@ccclass('PausableParticles')
export class PausableParticles extends ParticleSystem2D {

    public paused = false;
    
    protected lateUpdate(dt: any) {
        if (this.paused) return;

        super.lateUpdate(dt);
    }
}

