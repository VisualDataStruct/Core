import { Complie } from './compile';
import { PlayStatus, OperBlocks } from './const';
import OperateList from './operateList';
import Comment from './comment';
import Bus from '../bus';
import _ from 'lodash';
import BaseList from '../lib/list/baseList';
import Storage from '../lib/widget/const/storage';
export default class Run {
    constructor(json) {
        this.playStatus = PlayStatus.Stop;
        this.blockly = {};
        this.varSet = {};
        this.allStep = -1;
        this.step = 0;
        this.blockJson = json;
        this.operateList = new OperateList();
        this.commentList = null;
        this.blockly = JSON.parse(this.blockJson);
        this.varSet = Complie.getVar({
            var: this.blockly._var,
            sp_var: this.blockly._sp_var,
        });
    }
    setInitVar(varList) {
        for (const key in varList) {
            if (varList.hasOwnProperty(key)) {
                const value = varList[key];
                this.varSet[key] = value;
            }
        }
        console.log(this.varSet);
    }
    compile() {
        Complie.explain(this.operateList, this.blockly.code[0], this.varSet);
        Storage.animation.clearAnimation();
        this.allStep = this.operateList.opList.length;
    }
    /**
     * 获得伪代码列表
     *
     * @returns {Array<{[key: string]: any}>}
     * @memberof Run
     */
    getComment() {
        if (this.commentList === null) {
            this.commentList = [];
            Comment.getComment(this.blockly.code[0], this.commentList);
        }
        return this.commentList;
    }
    stop() {
        this.playStatus = PlayStatus.Stop;
        this.jumpTo(0);
    }
    start() {
        const second = Storage.animation.getPlaySecond();
        this.playStatus = PlayStatus.Playing;
        this.nxtStep();
        setTimeout(() => {
            if (this.playStatus === PlayStatus.Playing) {
                this.start();
            }
        }, second * 1500);
    }
    pause() {
        this.playStatus = PlayStatus.Pause;
    }
    jumpTo(step) {
        this.pause();
        Storage.animation.clearAnimation();
        while (step > this.step) {
            this.doNxtStep();
        }
        while (step < this.step) {
            this.doPreStep();
        }
        Bus.emit('changeComment', this.operateList.opList[Math.max(0, this.step - 1)].commentId);
        this.render();
    }
    preStep() {
        this.doPreStep();
        Bus.emit('changeComment', this.operateList.opList[Math.max(0, this.step - 1)].commentId);
        this.render();
    }
    nxtStep() {
        this.doNxtStep();
        Bus.emit('changeComment', this.operateList.opList[Math.max(0, this.step - 1)].commentId);
        this.render();
    }
    render() {
        for (const key in this.varSet.baseList) {
            if (this.varSet.baseList.hasOwnProperty(key)) {
                const baselist = this.varSet.baseList[key];
                if (baselist instanceof BaseList) {
                    baselist.addToAnimation();
                }
            }
        }
        Storage.animation.startAnimation();
    }
    doPreStep() {
        if (this.step === 0) {
            this.playStatus = PlayStatus.Begin;
            return OperBlocks.FINISH;
        }
        --this.step;
        const operate = this.operateList.opList[this.step];
        switch (operate.type) {
            case OperBlocks.IF:
            case OperBlocks.LOOP_REPEAT:
            case OperBlocks.LOOP_WHILE:
            case OperBlocks.LOOP_UNTIL:
            case OperBlocks.LOOP_FOR:
            case OperBlocks.LOOP_FLOW_CONTROLS:
                break;
            case OperBlocks.VAR_SET:
            case OperBlocks.VAR_ADD:
            case OperBlocks.LIST_GET_INDEX:
            case OperBlocks.LIST_SET_INDEX:
            case OperBlocks.BASELIST_SET_POSITION:
            case OperBlocks.BASELIST_SET:
            case OperBlocks.BASELIST_CREATE_FROM:
            case OperBlocks.BASELIST_REMOVE_NODE_ONVIEW:
            case OperBlocks.BASELIST_REMOVE_NODE_REAL:
            case OperBlocks.BASELIST_MOVE_TO_NEXT:
            case OperBlocks.BASELIST_NOW_POINT_TO_OTHER:
            case OperBlocks.BASELIST_NEW_POINT_TO_OTHER:
            case OperBlocks.BASELIST_ADD_NEW_NODE_TRUE:
            case OperBlocks.BASELIST_CREATE_NEW_NODE:
            case OperBlocks.BASENODE_SET:
                operate.changes.forEach((change) => {
                    this.varSet[change.vSet][change.vName] = _.cloneDeep(change.before);
                });
                break;
            default:
                return OperBlocks.ERROR;
        }
        return OperBlocks.FINISH;
    }
    doNxtStep() {
        if (this.step === this.allStep) {
            this.playStatus = PlayStatus.End;
            return OperBlocks.FINISH;
        }
        const operate = this.operateList.opList[this.step];
        ++this.step;
        switch (operate.type) {
            case OperBlocks.IF:
            case OperBlocks.LOOP_REPEAT:
            case OperBlocks.LOOP_WHILE:
            case OperBlocks.LOOP_UNTIL:
            case OperBlocks.LOOP_FOR:
            case OperBlocks.LOOP_FLOW_CONTROLS:
                break;
            case OperBlocks.VAR_SET:
            case OperBlocks.VAR_ADD:
            case OperBlocks.LIST_GET_INDEX:
            case OperBlocks.LIST_SET_INDEX:
            case OperBlocks.BASELIST_SET_POSITION:
            case OperBlocks.BASELIST_SET:
            case OperBlocks.BASELIST_CREATE_FROM:
            case OperBlocks.BASELIST_REMOVE_NODE_ONVIEW:
            case OperBlocks.BASELIST_REMOVE_NODE_REAL:
            case OperBlocks.BASELIST_MOVE_TO_NEXT:
            case OperBlocks.BASELIST_NOW_POINT_TO_OTHER:
            case OperBlocks.BASELIST_NEW_POINT_TO_OTHER:
            case OperBlocks.BASELIST_ADD_NEW_NODE_TRUE:
            case OperBlocks.BASELIST_CREATE_NEW_NODE:
            case OperBlocks.BASENODE_SET:
                operate.changes.forEach((change) => {
                    this.varSet[change.vSet][change.vName] = _.cloneDeep(change.after);
                });
                break;
            default:
                return OperBlocks.ERROR;
        }
        return OperBlocks.FINISH;
    }
}
