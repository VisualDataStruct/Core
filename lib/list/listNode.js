import Node from '../widget/node';
export default class ListNode extends Node {
    /**
     * 实例化链表结点
     * @param {string} [val='-1']
     * @memberof ListNode
     */
    constructor(val = '-1') {
        super(val);
        this.prevNode = null;
        this.nxtNode = null;
        this.showNext = null;
        this.showPrev = null;
        this.newNext = false;
        this.newPrev = false;
        this.removeNext = false;
        this.removePrev = false;
        this.moveNext = false;
        this.movePrev = false;
    }
    /**
     * 将绘制 连线 的参数全置为 false
     *
     * @memberof ListNode
     */
    initLineAnimation() {
        this.newNext = false;
        this.newPrev = false;
        this.removeNext = false;
        this.removePrev = false;
        this.moveNext = false;
        this.movePrev = false;
    }
}
