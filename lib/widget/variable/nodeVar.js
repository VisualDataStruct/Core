import Position from '../../../BaseWidget/position';
export default class NodeVar {
    /**
     * 实例化 结点变量 对象
     * @param {string} name
     * @memberof nodeVar
     */
    constructor(name) {
        this.name = name;
        this.pos = new Position(-300, -300, 1);
        this.prePos = new Position(-300, -300, 1);
        this.offsetY = 30; //  * Storage.scale;
        this.color = '#000000';
    }
}
