export default class Helper {
    /**
     * 获取一个在[min, max)中的一个随机整数
     *
     * @static
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @memberof Helper
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * 用于sort方法的函数
     * 将 string 转换成 number
     * 从小到大
     *
     * @static
     * @param {string} a
     * @param {string} b
     * @returns {number}
     * @memberof Helper
     */
    static sortStringToNumberSmallToBig(a, b) {
        if (parseInt(a, 10) > parseInt(b, 10)) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
