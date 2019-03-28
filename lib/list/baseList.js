import ListNode from './listNode';
import { Status } from '../widget/const/enums';
import Storage from '../widget/const/storage';
import Helper from '../widget/helper';
import Position from '../../BaseWidget/position';
import Color from '../widget/const/color';
import NodeVar from '../widget/variable/nodeVar';
export default class BaseList {
    /**
     * 实例化一个链表
     * @memberof BaseList
     */
    constructor() {
        this.HEAD = new ListNode('HEAD');
        this.nowAt = this.HEAD;
        this.nodeNumber = 0;
        this.nowPos = 0;
        this.newNode = null;
        this.newNodePrev = null;
        this.removedNode = null;
        this.removeNodePrev = null;
        this.unique = false;
        this.errorMsg = '';
        this.headPosition = new Position(50, 200, 1);
        this.HEAD.pos.setPos(50, 200);
        this.removedNodeOffsetY = 100; // * Storage.scale;
        this.newNodeOffsetY = 100; // * Storage.scale;
        this.gapDis = 100; // * Storage.scale;
        this.nowVar = new NodeVar('now');
        this.nowVar.pos = this.nowAt.pos;
        this.nowVar.prePos = new Position(50, 200, 1);
    }
    /**
     * 将链表的置为初始状态
     *
     * @memberof BaseList
     */
    init() {
        this.nowPos = 0;
        this.nowAt = this.HEAD;
        this.nowVar.pos.setPos(50, 200);
        let now = this.HEAD;
        while (now.nxtNode !== null) {
            now = now.nxtNode;
            now.status = Status.Default;
        }
    }
    /**
     * 设置第一个结点的位置
     *
     * @param {number} x
     * @param {number} y
     * @memberof BaseList
     */
    setHeadPosition(x, y) {
        // 将头结点设置成一个 间隔 之前
        this.headPosition.setPos(x, y);
    }
    /**
     * 设置 当前 变量的名字
     *
     * @param {string} [name='now']
     * @memberof BaseList
     */
    setNowVarName(name = 'now') {
        this.nowVar.name = name;
    }
    /**
     * 获取当前结点
     *
     * @returns {ListNode}
     * @memberof BaseList
     */
    now() {
        return this.nowAt;
    }
    /**
     * 移除当前结点的下一个结点（显示上）
     *
     * @returns {boolean}
     * @memberof BaseList
     */
    removeNode() {
        if (this.nodeNumber <= 0) {
            return false;
        }
        if (this.nowAt.showNext === null) {
            return false;
        }
        this.removeNodePrev = this.nowAt;
        this.removedNode = this.nowAt.showNext;
        this.nowAt.showNext = this.nowAt.showNext.showNext;
        // 添加划线动画
        this.removeNodePrev.newNext = true;
        return true;
    }
    /**
     * 设置被移除结点的纵向偏移量
     *
     * @param {number} offset
     * @memberof BaseList
     */
    setRemoveNodeOffsetY(offset) {
        this.removedNodeOffsetY = offset;
    }
    /**
     * 设置新增结点的纵向偏移量
     *
     * @param {number} offset
     * @memberof BaseList
     */
    setNewNodeOffsetY(offset) {
        this.newNodeOffsetY = offset;
    }
    /**
     * 从链表中删除被移除的结点（实际删除）
     *
     * @returns {boolean}
     * @memberof BaseList
     */
    trueRemoveNode() {
        if (this.removedNode === null || this.removeNodePrev === null) {
            return false;
        }
        // TEST 添加删除动画
        // this.removedNode.removeNext = true;
        this.removeNodePrev.nxtNode = this.removeNodePrev.showNext;
        Storage.removedNodes[this.removedNode.id] = 1;
        // delete this.removedNode;
        // this.removedNode = null;
        this.removeNodePrev = null;
        --this.nodeNumber;
        return true;
    }
    /**
     * 移动到下一个结点
     *
     * @returns {boolean}
     * @memberof BaseList
     */
    moveToNxt() {
        // 添加移动动画
        this.nowAt.status = Status.Visited;
        this.nowAt.moveNext = true;
        if (this.nowAt.showNext === null) {
            return false;
        }
        else {
            this.nowAt = this.nowAt.showNext;
            this.nowVar.prePos = this.nowVar.pos;
            this.nowVar.pos = this.nowAt.pos;
            this.nowAt.status = Status.Hover;
            ++this.nowPos;
            return true;
        }
    }
    /**
     * 将当前结点指向 otherNode （显示上）
     *
     * @param {(ListNode|null)} otherNode
     * @memberof BaseList
     */
    nowShowNxtPointTo(otherNode) {
        // 添加划线动画
        this.nowAt.showNext = otherNode;
        this.nowAt.newNext = true;
    }
    /**
     * 将新结点指向 otherNode （显示上）
     *
     * @param {(ListNode|null)} otherNode
     * @returns {boolean}
     * @memberof BaseList
     */
    newShowNxtPointTo(otherNode) {
        // 添加划线动画
        if (this.newNode === null) {
            return false;
        }
        else {
            this.newNode.showNext = otherNode;
            this.newNode.newNext = true;
            return true;
        }
    }
    /**
     * 将新结点添加进链表（实际上）
     *
     * @returns {boolean}
     * @memberof BaseList
     */
    trueAddNode() {
        if (this.newNode === null) {
            return false;
        }
        this.nowAt.nxtNode = this.nowAt.showNext;
        this.newNode.nxtNode = this.newNode.showNext;
        this.newNode = null;
        return true;
    }
    /**
     * 获取新结点
     *
     * @returns {(ListNode|null)}
     * @memberof BaseList
     */
    getNewNode() {
        return this.newNode;
    }
    /**
     * 生成新结点
     *
     * @param {ListNode} newNode
     * @returns {boolean}
     * @memberof BaseList
     */
    createNewNode(newNode) {
        if (this.nodeNumber === Storage.MAX_LIST_NODE_NUMBER) {
            return false;
        }
        if (this.unique === true && this.hasDuplicateValue(newNode.getVal(newNode.getDefaultShow()))) {
            return false;
        }
        this.newNodePrev = this.nowAt;
        this.newNode = newNode;
        this.newNode.pos.setPos(this.nowAt.pos.x + this.gapDis, this.nowAt.pos.y + this.newNodeOffsetY);
        ++this.nodeNumber;
        return true;
    }
    /**
     * 随机生成一个链表
     *
     * @memberof BaseList
     */
    randomList() {
        const nodeNumber = Helper.randomInt(2, Storage.MAX_LIST_NODE_NUMBER);
        this.randomListWithNodeNumber(nodeNumber);
    }
    /**
     * 随机生成一个从小到大排序的链表
     *
     * @memberof BaseList
     */
    randomSortedList() {
        const nodeNumber = Helper.randomInt(2, Storage.MAX_LIST_NODE_NUMBER);
        const valueList = this.newListNumber(nodeNumber);
        valueList.sort(Helper.sortStringToNumberSmallToBig);
        this.userDefineList(valueList);
    }
    /**
     * 随机生成一个确定结点数量的链表
     *
     * @param {number} nodeNumber
     * @memberof BaseList
     */
    randomListWithNodeNumber(nodeNumber) {
        this.userDefineList(this.newListNumber(nodeNumber));
    }
    /**
     * 用户定义链表元素
     *
     * @param {string[]} value
     * @returns {boolean}
     * @memberof BaseList
     */
    userDefineList(value) {
        if (value.length > Storage.MAX_LIST_NODE_NUMBER) {
            return false;
        }
        if (this.unique) {
            const o = {};
            value.forEach((v) => {
                if (o[v] === 1) {
                    return false;
                }
                else {
                    o[v] = 1;
                }
            });
        }
        this.nodeNumber = value.length;
        this.nowAt = this.HEAD;
        value.forEach((v) => {
            const newNode = new ListNode(v);
            this.nowAt.nxtNode = newNode;
            this.nowAt.showNext = newNode;
            this.nowAt = newNode;
        });
        this.nowAt = this.HEAD;
        return true;
    }
    /**
     * 绘制链表
     *
     * @memberof BaseList
     */
    addToRender() {
        this.calcPosition();
        let now = this.HEAD;
        // 添加链表上每一个结点（实际上）
        while (now.nxtNode !== null) {
            now = now.nxtNode;
            this.addNodeToRender(now);
            if (now.newNext && this.removedNode && this.removedNode.nxtNode) {
                Storage.render.addLine(now.pos, this.removedNode.pos, '#000000');
            }
            else if (now.newNext && now.showNext) {
                Storage.render.addLine(now.pos, now.showNext.pos, '#000000');
            }
            if (now.moveNext && now.nxtNode) {
                Storage.render.addLine(now.pos, now.nxtNode.pos, Color.lineColor[Status.Hover]);
            }
        }
        // 添加 新结点
        if (this.newNode !== null) {
            this.addNodeToRender(this.newNode);
            if (this.newNode.newNext && this.newNode.showNext) {
                Storage.render.addLine(this.newNode.pos, this.newNode.showNext.pos, '#000000');
            }
        }
        // 将 当前结点 变量名渲染
        // if (this.nowAt !== this.HEAD) {
        this.nowVar.prePos = this.nowVar.pos;
        Storage.render.addText(this.nowVar.pos.x, this.nowVar.pos.y + this.nowVar.offsetY, this.nowVar.name, this.nowVar.color);
        // }
    }
    /**
     * 将链表添加进动画绘制
     *
     * @memberof BaseList
     */
    addToAnimation() {
        this.calcPosition();
        let now = this.HEAD;
        // 添加 HEAD
        Storage.animation.addListNodeToAnimation(now);
        if (now.newNext && this.removedNode && this.removedNode.nxtNode) {
            Storage.animation.addNewLineToAnimation(now, this.removedNode.nxtNode, '#000000');
        }
        else if (now.newNext && now.showNext) {
            Storage.animation.addNewLineToAnimation(now, now.showNext, '#000000');
        }
        if (now.moveNext && now.nxtNode) {
            Storage.animation.addNewLineToAnimation(now, now.nxtNode, Color.lineColor[Status.Hover]);
        }
        // 添加链表上每一个结点（实际上）
        while (now.nxtNode !== null) {
            now = now.nxtNode;
            Storage.animation.addListNodeToAnimation(now);
            // 添加连线
            if (now.newNext && this.removedNode && this.removedNode.nxtNode) {
                Storage.animation.addNewLineToAnimation(now, this.removedNode.nxtNode, '#000000');
            }
            else if (now.newNext && now.showNext) {
                Storage.animation.addNewLineToAnimation(now, now.showNext, '#000000');
            }
            if (now.moveNext && now.nxtNode) {
                Storage.animation.addNewLineToAnimation(now, now.nxtNode, Color.lineColor[Status.Hover]);
            }
            // now.initLineAnimation();
        }
        // // TEST 移除连线
        // if (this.removedNode && this.removedNode.removeNext && this.removedNode.nxtNode) {
        //   Storage.animation.addRemoveLineToAnimation(this.removedNode, this.removedNode.nxtNode, '#000000');
        // }
        // 添加 新结点
        if (this.newNode !== null) {
            Storage.animation.addListNodeToAnimation(this.newNode);
            if (this.newNode.newNext && this.newNode.showNext) {
                Storage.animation.addNewLineToAnimation(this.newNode, this.newNode.showNext, '#000000');
            }
        }
        // 将 当前结点 变量名渲染
        if (this.nowAt !== this.HEAD) {
            Storage.animation.addNodeVarToAnimation(this.nowVar);
        }
    }
    /**
     * 初始化每一个结点的位置
     *
     * @memberof BaseList
     */
    initPosition() {
        const y = this.headPosition.y;
        let x = this.headPosition.x;
        let now = this.HEAD;
        while (now !== null) {
            now.pos.setPos(x, y);
            x += this.gapDis;
            now = now.nxtNode;
        }
        if (this.removedNode !== null) {
            this.removedNode.pos.y += this.removedNodeOffsetY;
        }
        // 计算 新结点 的位置
        if (this.newNode !== null && this.newNodePrev !== null) {
            this.newNode.pos.setPos(this.newNodePrev.pos.x + this.gapDis, this.newNodePrev.pos.y + this.newNodeOffsetY);
        }
    }
    /**
     * 计算每一个结点的位置
     *
     * @private
     * @memberof BaseList
     */
    calcPosition() {
        const y = this.headPosition.y;
        let x = this.headPosition.x;
        let now = this.HEAD;
        while (now !== null) {
            now.nxtPos.setPos(x, y);
            x += this.gapDis;
            now = now.nxtNode;
        }
        if (this.removedNode !== null) {
            this.removedNode.nxtPos.y += this.removedNodeOffsetY;
        }
        // 计算 新结点 的位置
        if (this.newNode !== null && this.newNodePrev !== null) {
            this.newNode.nxtPos.setPos(this.newNodePrev.nxtPos.x + this.gapDis, this.newNodePrev.nxtPos.y + this.newNodeOffsetY);
        }
    }
    /**
     * 检测链表中是否已经有相同的值
     *
     * @private
     * @param {string} value
     * @returns {boolean}
     * @memberof BaseList
     */
    hasDuplicateValue(value) {
        const o = {};
        let tmp = this.HEAD;
        while (tmp.nxtNode !== null) {
            tmp = tmp.nxtNode;
            const v = tmp.getVal(tmp.getDefaultShow());
            o[v] = 1;
        }
        if (o[value] === 1) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 给定链表元素个数，获得新链表的值
     *
     * @private
     * @param {number} nodeNumber
     * @returns {string[]}
     * @memberof BaseList
     */
    newListNumber(nodeNumber) {
        const valueList = [];
        const maxValue = Storage.MAX_INIT_NODE_VALUE;
        if (this.unique) {
            const o = {};
            for (let i = 0; i < nodeNumber; ++i) {
                let tmp = Helper.randomInt(0, maxValue).toString();
                while (o[tmp] === 1) {
                    tmp = Helper.randomInt(0, maxValue).toString();
                }
                valueList.push(tmp);
            }
        }
        else {
            for (let i = 0; i < nodeNumber; ++i) {
                valueList.push(Helper.randomInt(0, maxValue).toString());
            }
        }
        return valueList;
    }
    /**
     * 绘制链表结点
     *
     * @private
     * @param {ListNode} node
     * @memberof BaseList
     */
    addNodeToRender(node) {
        node.initLineAnimation();
        let circleColor = Color.defaultColor;
        let textColor = Color.defaultColor;
        let filled = false;
        if (node.status !== Status.Default) {
            circleColor = Color.circleColor[node.status];
            textColor = Color.textColor[node.status];
        }
        if (node.status === Status.Hover) {
            filled = true;
        }
        // Add Node
        Storage.render.addCircle(node.nowPos.x, node.nowPos.y, node.r, circleColor, filled);
        Storage.render.addText(node.nowPos.x, node.nowPos.y, node.getVal(node.getDefaultShow()), textColor);
        Storage.nodes[node.id] = node;
        // Add Next Line
        if (node.showNext !== null) {
            let nxtLineColor = Color.defaultColor;
            if (node.status === Status.Visited && node.showNext.status !== Status.Default) {
                nxtLineColor = Color.lineColor[node.status];
            }
            if (!node.newNext && !node.removeNext) {
                Storage.render.addLine(node.nowPos, node.showNext.nowPos, nxtLineColor, true);
            }
        }
        // Add Prev Line
        if (node.showPrev !== null) {
            let preLineColor = Color.defaultColor;
            if (node.status === Status.Visited && node.showPrev.status !== Status.Default) {
                preLineColor = Color.lineColor[node.status];
            }
            if (!node.newPrev && !node.removePrev) {
                Storage.render.addLine(node.nowPos, node.showPrev.nowPos, preLineColor, true);
            }
        }
    }
}
