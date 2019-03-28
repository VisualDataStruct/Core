export default class Operate {
    constructor(t, i, c = []) {
        this.type = t;
        this.changes = c;
        this.id = i;
    }
    /**
     * 获得伪代码编号
     *
     * @readonly
     * @type {number}
     * @memberof Operate
     */
    get commentId() {
        return this.id;
    }
}
