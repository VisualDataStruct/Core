import ListNode from '../../list/listNode';
import Storage from '../const/storage';
import Color from '../const/color';
import { Status } from '../const/enums';
import Position from '../../../BaseWidget/position';
export default class Animation {
    /**
     * 生成一个动画类的实例
     * @memberof Animation
     */
    constructor() {
        this.needToAddAnimation = [];
        this.isPlaying = false;
        this.playSecond = 1;
        this.frames = 60;
        this.nowFrames = 0;
        this.nodeList = [];
        this.animationId = -1;
    }
    /**
     * 修改播放动画的时间长度（单位：秒）
     *
     * @param {number} second
     * @memberof Animation
     */
    changePlaySecond(second) {
        this.playSecond = second;
        this.frames = Math.floor(this.playSecond * 60);
    }
    /**
     * 获得动画播放的时间长度（单位：秒）
     *
     * @returns {number}
     * @memberof Animation
     */
    getPlaySecond() {
        return this.playSecond;
    }
    /**
     * 添加一个链表结点到动画
     *
     * @param {ListNode} node
     * @memberof Animation
     */
    addListNodeToAnimation(node) {
        node.nowPos = node.pos;
        this.nodeList.push(node);
        this.needToAddAnimation.push({
            type: 'ListNode',
            value: node,
        });
    }
    /**
     * 添加新建一条线的动画
     *
     * @param {Node} startNode
     * @param {Node} endNode
     * @param {string} color
     * @memberof Animation
     */
    addNewLineToAnimation(startNode, endNode, color) {
        if (startNode instanceof ListNode) {
            this.nodeList.push(startNode);
        }
        if (endNode instanceof ListNode) {
            this.nodeList.push(endNode);
        }
        this.needToAddAnimation.push({
            type: 'NewLine',
            nowPos: new Position(startNode.pos.x, startNode.pos.y, 1),
            startPos: startNode.pos,
            endPos: endNode.pos,
            color,
        });
    }
    /**
     * 添加 结点变量 的动画
     *
     * @param {NodeVar} v
     * @memberof Animation
     */
    addNodeVarToAnimation(v) {
        this.needToAddAnimation.push({
            type: 'NodeVar',
            nodeVar: v,
        });
    }
    /**
     * 开始动画
     *
     * @returns {boolean}
     * @memberof Animation
     */
    startAnimation() {
        if (this.isPlaying === false) {
            this.isPlaying = true;
            this.nowFrames = 0;
            // 绘制初始状态
            this.addToRender();
            // 绘制每一帧动画
            this.drawFrame();
            return true;
        }
        else {
            return false;
        }
    }
    clearAnimation() {
        // this.addToRender();
        this.fixPosition();
        this.fixStatus();
        this.isPlaying = false;
        this.needToAddAnimation = [];
        // Storage.render.render();
        if (this.animationId !== -1) {
            window.cancelAnimationFrame(this.animationId);
            this.animationId = -1;
        }
        return true;
    }
    /**
     * 开始每一帧
     *
     * @private
     * @returns {void}
     * @memberof Animation
     */
    drawFrame() {
        if (this.nowFrames === this.frames) {
            this.fixPosition();
            this.fixStatus();
            this.addToRender();
            this.isPlaying = false;
            this.needToAddAnimation = [];
            return;
        }
        this.animationId = requestAnimationFrame(() => {
            ++this.nowFrames;
            // 计算节点下一帧的位置
            this.needToAddAnimation.forEach((animation) => {
                let node;
                let x;
                let y;
                let startPos;
                let nowPos;
                let endPos;
                let dx;
                let dy;
                let dis;
                let moveX;
                let moveY;
                switch (animation.type) {
                    case 'ListNode':
                        node = animation.value;
                        if (node.nxtPos === null) {
                            break;
                        }
                        x = node.pos.x + (node.nxtPos.x - node.pos.x) * this.nowFrames / this.frames;
                        y = node.pos.y + (node.nxtPos.y - node.pos.y) * this.nowFrames / this.frames;
                        node.nowPos.setPos(x, y);
                        break;
                    case 'NewLine':
                        startPos = animation.startPos;
                        nowPos = animation.nowPos;
                        endPos = animation.endPos;
                        dx = endPos.x - startPos.x;
                        dy = endPos.y - startPos.y;
                        dis = Math.sqrt(dx * dx + dy * dy);
                        moveX = Storage.NODE_RADIUS * dx / dis;
                        moveY = Storage.NODE_RADIUS * dy / dis;
                        x = startPos.x + 2 * moveX + (endPos.x - startPos.x - 2 * moveX) * this.nowFrames / this.frames;
                        y = startPos.y + 2 * moveY + (endPos.y - startPos.y - 2 * moveY) * this.nowFrames / this.frames;
                        nowPos.setPos(x, y);
                        break;
                    case 'NodeVar':
                        // TODO
                        break;
                    // case 'RemoveLine':
                    //   startPos = animation.startPos;
                    //   nowPos = animation.nowPos;
                    //   endPos = animation.endPos;
                    //   dx = endPos.x - startPos.x;
                    //   dy = endPos.y - startPos.y;
                    //   dis = Math.sqrt(dx * dx + dy * dy);
                    //   moveX = Storage.NODE_RADIUS * dx / dis;
                    //   moveY = Storage.NODE_RADIUS * dy / dis;
                    //   startPos = animation.startPos;
                    //   nowPos = animation.nowPos;
                    //   endPos = animation.endPos;
                    //   // TEST 测试计算是否正确
                    //   x = startPos.x + 2 * moveX + (endPos.x - startPos.x - 2 * moveX) * (1 - this.nowFrames / this.frames);
                    //   y = startPos.y + 2 * moveY + (endPos.y - startPos.y - 2 * moveY) * (1 - this.nowFrames / this.frames);
                    //   nowPos.setPos(x, y);
                    //   break;
                }
            });
            // 添加渲染
            this.addToRender();
            // 绘制下一帧
            this.drawFrame();
        });
    }
    fixStatus() {
        this.nodeList.forEach((listNode) => {
            listNode.initLineAnimation();
        });
    }
    /**
     * 动画结束之后修正结点的位置
     *
     * @private
     * @memberof Animation
     */
    fixPosition() {
        let node;
        let nodeVar;
        this.needToAddAnimation.forEach((animation) => {
            // let nowPos: Position;
            // let endPos: Position;
            switch (animation.type) {
                case 'ListNode':
                    node = animation.value;
                    node.initLineAnimation();
                    if (node.nxtPos !== null) {
                        node.pos.setPos(node.nxtPos.x, node.nxtPos.y);
                        node.nowPos.setPos(node.nxtPos.x, node.nxtPos.y);
                    }
                    break;
                case 'NewLine':
                    animation.type = 'DoNothing';
                    // nowPos = animation.nowPos;
                    // endPos = animation.endPos;
                    // nowPos.setPos(endPos.x, endPos.y);
                    break;
                case 'RemoveLine':
                    animation.type = 'DoNothing';
                    break;
                case 'NodeVar':
                    // TODO
                    nodeVar = animation.nodeVar;
                    nodeVar.prePos = nodeVar.pos;
                    break;
            }
        });
    }
    /**
     * 添加到绘制
     *
     * @private
     * @memberof Animation
     */
    addToRender() {
        this.needToAddAnimation.forEach((animation) => {
            let pos;
            switch (animation.type) {
                case 'ListNode':
                    this.addListNodeToRender(animation.value);
                    break;
                case 'NewLine':
                    this.addNewLineToRender(animation.startPos, animation.nowPos, animation.color);
                    break;
                case 'NodeVar':
                    pos = animation.nodeVar.prePos;
                    // console.log(node);
                    if (pos !== null) {
                        this.addNodeVarToRender(pos, animation.nodeVar.name, animation.nodeVar.offsetY, animation.nodeVar.color);
                    }
                    break;
                // case 'RemoveLine':
                //   this.addRemoveLineToRender(animation.startPos, animation.nowPos, animation.color);
                //   break;
            }
        });
        Storage.render.render();
    }
    /**
     * 添加连线动画到 render
     *
     * @private
     * @param {Position} startPos
     * @param {Position} endPos
     * @param {string} color
     * @memberof Animation
     */
    addNewLineToRender(startPos, endPos, color) {
        Storage.render.addLine(startPos, endPos, color, 
        // Color.lineColor[Status.Visited],
        true, 5.0);
    }
    addNodeVarToRender(pos, text, offsetY, color) {
        // console.log(pos.x, pos.y);
        // console.log(offsetY);
        Storage.render.addText(pos.x, pos.y + offsetY, text, color);
    }
    // private addRemoveLineToRender(startPos: Position, endPos: Position, color: string) {
    //   // FIXME REVIEW 试试要不要箭头 修改颜色
    //   Storage.render.addLine(
    //     startPos,
    //     endPos,
    //     color,
    //     false,
    //     5.0,
    //   );
    // }
    /**
     * 添加 ListNode 以及连线到 render
     *
     * @private
     * @param {ListNode} node
     * @memberof Animation
     */
    addListNodeToRender(node) {
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
