import Storage from '../const/storage';
import { Shape } from '../const/enums';
import Position from '../../../BaseWidget/position';
export default class Render {
    /**
     * 产生一个 Render 类的实例
     * @memberof Render
     */
    constructor() {
        this.needToRender = [];
        this.ctx = Storage.ctx;
    }
    /**
     * 添加圆圈到待绘制列表
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {string} color
     * @param {boolean} [filled=false]
     * @memberof Render
     */
    addCircle(x, y, radius, color, filled = false) {
        this.needToRender.push({
            type: Shape.Circle,
            x,
            y,
            r: radius,
            color,
            filled,
        });
    }
    /**
     * 添加文本到待绘制列表
     *
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {string} color
     * @memberof Render
     */
    addText(x, y, text, color) {
        this.needToRender.push({
            type: Shape.Text,
            x,
            y,
            text,
            color,
        });
    }
    /**
     * 添加连线到待绘制列表
     *
     * @param {Position} start
     * @param {Position} end
     * @param {string} color
     * @param {boolean} [hasArrow=false]
     * @param {number} [lineWidth=1.0]
     * @memberof Render
     */
    addLine(start, end, color, hasArrow = false, lineWidth = 1.0) {
        this.needToRender.push({
            type: Shape.Line,
            start,
            end,
            color,
            hasArrow,
            lineWidth,
        });
    }
    /**
     * 执行绘制
     *
     * @memberof Render
     */
    render() {
        Storage.canvas.height = Storage.canvas.height;
        Storage.addNodeToMap();
        this.needToRender.forEach((e) => {
            switch (e.type) {
                case Shape.Circle:
                    this.renderCircle(e.x, e.y, e.r, e.color, e.filled);
                    break;
                case Shape.Text:
                    this.renderText(e.x, e.y, e.text, e.color);
                    break;
                case Shape.Line:
                    this.renderLine(e.start, e.end, e.color, e.hasArrow, e.lineWidth);
                default:
                    break;
            }
        });
        this.needToRender = [];
    }
    /**
     * 绘制圆圈
     *
     * @private
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {string} color
     * @param {boolean} [filled=false]
     * @memberof Render
     */
    renderCircle(x, y, r, color, filled = false) {
        x *= Storage.scale;
        y *= Storage.scale;
        this.ctx.lineWidth = 2.0;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        if (filled) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }
    /**
     * 绘制文本
     *
     * @private
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {string} color
     * @memberof Render
     */
    renderText(x, y, text, color) {
        x *= Storage.scale;
        y *= Storage.scale;
        // console.log(text, x, y);
        this.ctx.lineWidth = 2.0;
        this.ctx.beginPath();
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    }
    /**
     * 绘制连线
     *
     * @private
     * @param {Position} start
     * @param {Position} end
     * @param {string} color
     * @param {boolean} hasArrow
     * @param {number} lineWidth
     * @memberof Render
     */
    renderLine(start, end, color, hasArrow, lineWidth) {
        start.scale = Storage.scale;
        end.scale = Storage.scale;
        this.ctx.lineWidth = 2.0;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dis = Math.sqrt(dx * dx + dy * dy);
        const moveX = Storage.NODE_RADIUS * dx / dis;
        const moveY = Storage.NODE_RADIUS * dy / dis;
        const pedal = new Position(0, 0, 1);
        if (hasArrow) {
            pedal.setPos(end.x - moveX - Storage.ARROW_LENGTH * dx / dis, end.y - moveY - Storage.ARROW_LENGTH * dy / dis); // 垂足坐标
            const halfBottom = Storage.ARROW_LENGTH * Math.sin(Storage.ARROW_ANGLE / 360 * Math.PI);
            const offsetX = halfBottom * dy / dis;
            const offsetY = halfBottom * dx / dis;
            this.ctx.beginPath();
            this.ctx.moveTo(end.x - moveX, end.y - moveY);
            this.ctx.lineTo(pedal.x + offsetX, pedal.y - offsetY);
            this.ctx.lineTo(pedal.x - offsetX, pedal.y + offsetY);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
        }
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(start.x + moveX, start.y + moveY);
        // const diffX = hasArrow ? Storage.ARROW_LENGTH : 0;
        // const diffY = hasArrow ? Storage.ARROW_LENGTH : 0;
        if (hasArrow) {
            this.ctx.lineTo(pedal.x, pedal.y);
        }
        else {
            this.ctx.lineTo(end.x - moveX, end.y - moveY);
        }
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.lineWidth = 2.0;
        this.ctx.closePath();
        start.scale = 1;
        end.scale = 1;
    }
}
