import { Label, _decorator } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('RecordItemUI')
@menu('UI/RecordItemUI')
export class RecordItemUI extends GameComponent {

    @property({
        type: Label
    }) playerName: Label;
    @property({
        type: Label
    }) score: Label;
}

