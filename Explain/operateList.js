export default class OperateList {
    constructor() {
        this.opList = [];
    }
    /**
     * 插入操作
     *
     * @param {Operate} op
     * @memberof OperateList
     */
    insert(op) {
        this.opList.push(op);
    }
}
