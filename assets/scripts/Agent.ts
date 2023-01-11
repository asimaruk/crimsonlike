import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Agent')
export class Agent extends Component {

    @property
    speed: number = 10;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

