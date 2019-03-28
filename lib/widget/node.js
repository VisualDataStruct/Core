import Position from '../../BaseWidget/position';
import Storage from './const/storage';
import { Status } from './const/enums';
export default class Node {
    /**
     * 初始化结点
     * @param {string} [val='-1']
     * @memberof Node
     */
    constructor(val = '-1') {
        this.id = Storage.getNodeId();
        this.val = {};
        this.pos = new Position(100, 100, 1);
        this.nxtPos = new Position(100, 100, 1);
        this.nowPos = new Position(100, 100, 1);
        this.val.val = val;
        this.defaultShow = 'val';
        this.r = Storage.NODE_RADIUS;
        this.privateData = {};
        this.status = Status.Default;
    }
    /**
     * 设置结点的值（通过键值对）
     *
     * @param {string} key
     * @param {string} val
     * @memberof Node
     */
    setVal(key, val) {
        this.val[key] = val;
    }
    /**
     * 获取结点的值
     *
     * @param {string} key
     * @returns {string}
     * @memberof Node
     */
    getVal(key) {
        return this.val[key] || '';
    }
    /**
     * 设置默认展示的 键
     *
     * @param {string} key
     * @memberof Node
     */
    setDefaultShow(key) {
        this.defaultShow = key;
    }
    /**
     * 获取默认展示的是哪个键
     *
     * @returns {string}
     * @memberof Node
     */
    getDefaultShow() {
        return this.defaultShow;
    }
    /**
     * 添加私有变量的键
     *
     * @param {string} key
     * @memberof Node
     */
    addPrivateData(key) {
        this.privateData[key] = 1;
    }
    /**
     * 移除私有变量的键
     *
     * @param {string} key
     * @memberof Node
     */
    removePrivateData(key) {
        this.privateData[key] = 0;
    }
    /**
     * 获取所有私有变量的键
     *
     * @returns {string[]}
     * @memberof Node
     */
    getPrivateData() {
        const result = [];
        for (const key in this.privateData) {
            if (this.privateData.hasOwnProperty(key)) {
                if (this.privateData[key] === 1) {
                    result.push(key);
                }
            }
        }
        return result;
    }
    /**
     * 获取显示的数据（不包含私有变量）
     *
     * @returns {Array<{[key: string]: string}>}
     * @memberof Node
     */
    getShowData() {
        const result = [];
        for (const key in this.val) {
            if (this.val.hasOwnProperty(key)) {
                if (this.privateData[key] !== 1) {
                    result.push({
                        key,
                        value: this.val[key],
                    });
                }
            }
        }
        return result;
    }
}
