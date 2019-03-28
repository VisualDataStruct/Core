export default class Bus {
    /**
     * 监听事件
     *
     * @static
     * @param {string} event
     * @param {(...message: any) => void} handle
     * @memberof Bus
     */
    static on(event, handle) {
        if (this.message[event] === undefined) {
            this.message[event] = [];
        }
        this.message[event].push(handle);
    }
    /**
     * 触发事件
     *
     * @static
     * @param {string} event
     * @param {...any} handle
     * @memberof Bus
     */
    static emit(event, ...handle) {
        if (this.message[event] === undefined) {
            return;
        }
        this.message[event].forEach((fn) => {
            fn(handle);
        });
    }
}
/**
 * 事件和监听者
 *
 * @static
 * @memberof Bus
 */
Bus.message = {};
