export default class Position {
    /**
     * 计算缩放后的 x 坐标
     *
     * @readonly
     * @type {number}
     * @memberof Position
     */
    get x() {
        return this.scale * this.originX;
    }
    /**
     * 设置原始 x 的值
     *
     * @memberof Position
     */
    set x(x) {
        this.originX = x;
    }
    /**
     * 计算缩放后的 y 坐标
     *
     * @readonly
     * @type {number}
     * @memberof Position
     */
    get y() {
        return this.scale * this.originY;
    }
    /**
     * 设置原始 y 的值
     *
     * @memberof Position
     */
    set y(y) {
        this.originY = y;
    }
    /**
     * 初始化坐标
     *
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @memberof Position
     */
    constructor(x, y, scale) {
        this.originX = x;
        this.originY = y;
        this.scale = scale;
    }
    /**
     * 设置坐标
     *
     * @param {number} x
     * @param {number} y
     * @memberof Position
     */
    setPos(x, y) {
        this.originX = x;
        this.originY = y;
    }
}
