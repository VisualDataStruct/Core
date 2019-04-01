import Init from '../../../initShow';
export default class Storage {
    /**
     * 检测点击的判定半径 r * r 的矩形
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Storage
     */
    static get CHECK_RADIUS() {
        return 20 * this.scale;
    }
    /**
     * 结点的半径
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Storage
     */
    static get NODE_RADIUS() {
        return 20 * this.scale;
    }
    /**
     * 箭头长度
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Storage
     */
    static get ARROW_LENGTH() {
        return 10 * this.scale;
    }
    /**
     * 画布缩放比例, 返回宽高中偏小的值
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Storage
     */
    static get scale() {
        return Math.min(this.height / this.BASE_HEIGHT, this.width / this.BASE_WIDTH);
    }
    /**
     * 获取下一个结点的 id
     *
     * @static
     * @returns {number}
     * @memberof Storage
     */
    static getNodeId() {
        return ++Storage.nodeId;
    }
    /**
     * 向结点地图中添加结点
     *
     * @static
     * @memberof Storage
     */
    static addNodeToMap() {
        Init.initMap(this.height, this.width);
        for (const node in this.nodes) {
            if (this.nodes.hasOwnProperty(node)) {
                const element = this.nodes[node];
                if (element.pos.x < 0 || element.pos.x > this.width
                    || element.pos.y < 0 || element.pos.y > this.height
                    || (this.removedNodes.hasOwnProperty(element.id) && this.removedNodes[element.id] === 1)) {
                    continue;
                }
                this.map[Math.floor(element.pos.y)][Math.floor(element.pos.x)] = element.id;
            }
        }
    }
    /**
     * 检测点击事件，并返回被点击的元素id
     *
     * @static
     * @param {number} clickX
     * @param {number} clickY
     * @returns {number}
     * @memberof Storage
     */
    static checkClick(clickX, clickY) {
        const minX = Math.ceil(Math.max(clickX - this.CHECK_RADIUS, 0));
        const minY = Math.ceil(Math.max(clickY - this.CHECK_RADIUS, 0));
        const maxX = Math.min(clickX + this.CHECK_RADIUS, this.width);
        const maxY = Math.min(clickY + this.CHECK_RADIUS, this.height);
        for (let x = minX; x < maxX; ++x) {
            for (let y = minY; y < maxY; ++y) {
                if (this.map[y][x] !== 0) {
                    return this.map[y][x];
                }
            }
        }
        return 0;
    }
}
/**
 * 当前画布中的结点
 *
 * @static
 * @type {{[key: number]: Node}}
 * @memberof Storage
 */
Storage.nodes = {};
/**
 * 被移除的结点
 *
 * @static
 * @type {{[key: number]: number}}
 * @memberof Storage
 */
Storage.removedNodes = {};
/**
 * 画布结点地图，[height][width]
 *
 * @static
 * @type {number[][]}
 * @memberof Storage
 */
Storage.map = [];
/**
 * 画布基准高度
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.BASE_HEIGHT = 600;
/**
 * 画布基准宽度
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.BASE_WIDTH = 1000;
/**
 * 箭头角度
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.ARROW_ANGLE = 60;
/**
 * 链表最多结点数量
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.MAX_LIST_NODE_NUMBER = 10;
/**
 * 结点数据最长长度（位）
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.MAX_LIST_NODE_VALUE_LENGTH = 4;
/**
 * 最大的初始结点值
 *
 * @static
 * @type {number}
 * @memberof Storage
 */
Storage.MAX_INIT_NODE_VALUE = 100;
