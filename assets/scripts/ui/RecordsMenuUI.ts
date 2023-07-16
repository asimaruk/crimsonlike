import { _decorator, Component, Label, Layout, Node, tween, Tween } from 'cc';
import { RecordItemUI } from './RecordItemUI';
import { RecordsRepository } from 'records-repository-api';
const { ccclass, property } = _decorator;

@ccclass('RecordsMenuUI')
export class RecordsMenuUI extends Component {

    @property({
        type: Node
    }) loadSpinner: Node;
    @property({
        type: Layout
    }) recordsLayout: Layout;
    @property({
        type: Label
    }) error: Label;

    private recordItems: RecordItemUI[] = [];

    protected onLoad() {
        this.recordItems = this.recordsLayout.getComponentsInChildren(RecordItemUI);
    }

    showLoading() {
        this.recordsLayout.node.active = false;
        this.error.node.active = false;
        this.loadSpinner.active = true;
        this.loadSpinner.setRotationFromEuler(0, 0, 0)
        Tween.stopAllByTarget(this.loadSpinner);
        tween(this.loadSpinner)
            .by(0.7, { angle: -360 })
            .repeatForever()
            .start();
    }

    showError(text: string) {
        this.recordsLayout.node.active = false;
        this.loadSpinner.active = false;
        this.error.node.active = true;
        this.error.string = text;
    }

    showResult(records: RecordsRepository.Record[]) {
        Tween.stopAllByTarget(this.loadSpinner);
        this.loadSpinner.active = false;
        this.recordsLayout.node.active = true;
        this.error.node.active = false;
        this.recordItems.forEach((recItem, i) => {
            recItem.node.active = i < records.length;
            recItem.playerName.string = records[i]?.name;
            recItem.score.string = records[i]?.score?.toString();
        });
        this.recordsLayout.constraintNum = Math.ceil(records.length / 5);
    }
}

