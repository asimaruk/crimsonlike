import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property({
        type: Node
    })
    menuIU: Node;

    @property({
        type: Node
    })
    gameUI: Node;

    onLoad() {
        this.setMenuUIVisible(true);
        this.setGameUIVisible(false);
    }

    setMenuUIVisible(isVisible: boolean) {
        this.menuIU.active = isVisible;
    }

    setGameUIVisible(isVisible: boolean) {
        this.gameUI.active = isVisible;
    }
}

