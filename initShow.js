import Storage from './lib/widget/const/storage';
import Render from './lib/widget/action/render';
import bus from './bus';
import Animation from './lib/widget/action/animation';
export default class InitShow {
    /**
     * 初始化动画显示
     * @param height
     * @param width
     */
    static initAll(height = 600, width = 1000) {
        this.initCanvas(height, width);
        this.initRender();
        this.initAnimation();
        this.initMap(height, width);
        this.initListen();
        Storage.nodeId = 0;
    }
    /**
     * 初始化 结点地图
     * @param height
     * @param width
     */
    static initMap(height, width) {
        Storage.height = height;
        Storage.width = width;
        for (let x = 0; x < height; ++x) {
            Storage.map[x] = [];
            for (let y = 0; y < width; ++y) {
                Storage.map[x][y] = 0;
            }
        }
    }
    /**
     * 初始化 Canvas 画布
     * @param height 画布高度
     * @param width
     */
    static initCanvas(height, width) {
        // init canvas
        const canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;
        canvas.style.border = '1px solid #000000';
        // add canvas to html
        const div = document.getElementById('show-animation-canvas');
        if (div !== null) {
            div.appendChild(canvas);
        }
        Storage.canvas = canvas;
        // init ctx
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            Storage.ctx = ctx;
        }
    }
    /**
     * 初始化 动画 类
     */
    static initAnimation() {
        Storage.animation = new Animation();
    }
    /**
     * 初始化 渲染 类
     */
    static initRender() {
        Storage.render = new Render();
    }
    /**
     * 初始化事件监听
     */
    static initListen() {
        Storage.canvas.addEventListener('click', (e) => {
            const actualTop = Storage.canvas.getBoundingClientRect().top + window.pageYOffset;
            const actualLeft = Storage.canvas.getBoundingClientRect().left + window.pageXOffset;
            const result = Storage.checkClick(e.pageX - actualLeft, e.pageY - actualTop);
            if (result !== 0) {
                bus.emit('change-node', Storage.nodes[result]);
            }
            else {
                bus.emit('no-node', 1);
            }
        });
    }
}
