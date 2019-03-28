import { Blocks } from './const';
export default class Helper {
    static getIndend(n) {
        return (new Array(n + 1)).join('  ');
    }
    /**
     * 是否是质数
     *
     * @static
     * @param {number} x
     * @returns {boolean}
     * @memberof Helper
     */
    static isPrime(x) {
        const integer = Math.round(x);
        if (integer <= 1) {
            return false;
        }
        if (integer === 2) {
            return true;
        }
        const end = Math.ceil(Math.sqrt(x));
        for (let i = 3; i <= end; i += 2) {
            if (x % i === 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * 获得 [min, max] 的一个随机整数
     *
     * @static
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @memberof Helper
     */
    static randomInt(min, max) {
        if (min > max) {
            const tmp = min;
            min = max;
            max = tmp;
        }
        return Math.round(Math.random() * (max - min)) + min;
    }
    /**
     * 首字母大写
     *
     * @static
     * @param {string} text
     * @returns {string}
     * @memberof Helper
     */
    static titleCase(text) {
        return text.replace(/\S+/g, (str) => {
            return str[0].toUpperCase() + str.substring(1).toLowerCase();
        });
    }
    /**
     * 将字符串编译成 Blocks
     *
     * @static
     * @param {string} type
     * @returns {Blocks}
     * @memberof Helper
     */
    static complie(type) {
        switch (type) {
            case 'IF':
                return Blocks.IF;
            case 'COMPARE':
                return Blocks.COMPARE;
            case 'LOGIC_OPERATION':
                return Blocks.LOGIC_OPERATION;
            case 'BOOLEAN':
                return Blocks.BOOLEAN;
            case 'LOGIC_NULL':
                return Blocks.LOGIC_NULL;
            case 'LOOP_REPEAT':
                return Blocks.LOOP_REPEAT;
            case 'LOOP_WHILE':
                return Blocks.LOOP_WHILE;
            case 'LOOP_UNTIL':
                return Blocks.LOOP_UNTIL;
            case 'LOOP_FOR':
                return Blocks.LOOP_FOR;
            case 'LOOP_FLOW_CONTROLS':
                return Blocks.LOOP_FLOW_CONTROLS;
            case 'NUMBER':
                return Blocks.NUMBER;
            case 'MATH_OPERATOR':
                return Blocks.MATH_OPERATOR;
            case 'MATH_FUNCTION':
                return Blocks.MATH_FUNCTION;
            case 'MATH_CONSTANT':
                return Blocks.MATH_CONSTANT;
            case 'MATH_NUMBER_CHECK':
                return Blocks.MATH_NUMBER_CHECK;
            case 'MATH_RANDOM':
                return Blocks.MATH_RANDOM;
            case 'TEXT':
                return Blocks.TEXT;
            case 'TEXT_JOIN':
                return Blocks.TEXT_JOIN;
            case 'TEXT_LENGTH':
                return Blocks.TEXT_LENGTH;
            case 'TEXT_ISEMPTY':
                return Blocks.TEXT_ISEMPTY;
            case 'TEXT_INDEX_OF':
                return Blocks.TEXT_INDEX_OF;
            case 'TEXT_CHAR_AT':
                return Blocks.TEXT_CHAR_AT;
            case 'TEXT_GET_SUBSTRING':
                return Blocks.TEXT_GET_SUBSTRING;
            case 'TEXT_CHANGE_CASE':
                return Blocks.TEXT_CHANGE_CASE;
            case 'VAR_GET':
                return Blocks.VAR_GET;
            case 'VAR_SET':
                return Blocks.VAR_SET;
            case 'VAR_ADD':
                return Blocks.VAR_ADD;
            case 'LIST_CREATE_EMPTY':
                return Blocks.LIST_CREATE_EMPTY;
            case 'LIST_CREATE_WITH':
                return Blocks.LIST_CREATE_WITH;
            case 'LIST_CREATE_REPEAT':
                return Blocks.LIST_CREATE_REPEAT;
            case 'LIST_LENGTH':
                return Blocks.LIST_LENGTH;
            case 'LIST_IS_EMPTY':
                return Blocks.LIST_IS_EMPTY;
            case 'LIST_INDEX_OF':
                return Blocks.LIST_INDEX_OF;
            case 'LIST_GET_INDEX':
                return Blocks.LIST_GET_INDEX;
            case 'LIST_SET_INDEX':
                return Blocks.LIST_SET_INDEX;
            case 'BASELIST_SET_POSITION':
                return Blocks.BASELIST_SET_POSITION;
            case 'BASELIST_GET':
                return Blocks.BASELIST_GET;
            case 'BASELIST_CREATE_FROM':
                return Blocks.BASELIST_CREATE_FROM;
            case 'BASENODE_GET':
                return Blocks.BASENODE_GET;
            case 'BASENODE_SET':
                return Blocks.BASENODE_SET;
            case 'BASELIST_GET_NOW_NODE':
                return Blocks.BASELIST_GET_NOW_NODE;
            case 'BASELIST_REMOVE_NODE_ONVIEW':
                return Blocks.BASELIST_REMOVE_NODE_ONVIEW;
            case 'BASELIST_REMOVE_NODE_REAL':
                return Blocks.BASELIST_REMOVE_NODE_REAL;
            case 'BASELIST_MOVE_TO_NEXT':
                return Blocks.BASELIST_MOVE_TO_NEXT;
            case 'BASELIST_NOW_POINT_TO_OTHER':
                return Blocks.BASELIST_NOW_POINT_TO_OTHER;
            case 'BASELIST_NEW_POINT_TO_OTHER':
                return Blocks.BASELIST_NEW_POINT_TO_OTHER;
            case 'BASELIST_ADD_NEW_NODE_TRUE':
                return Blocks.BASELIST_ADD_NEW_NODE_TRUE;
            case 'BASELIST_GET_NEW_NODE':
                return Blocks.BASELIST_GET_NEW_NODE;
            case 'BASELIST_CREATE_NEW_NODE':
                return Blocks.BASELIST_CREATE_NEW_NODE;
            case 'BASELIST_SET':
                return Blocks.BASELIST_SET;
            case 'BASELIST_GET_NODE_NUMBER':
                return Blocks.BASELIST_GET_NODE_NUMBER;
            case 'BASELIST_GET_NOWNODE_VALUE':
                return Blocks.BASELIST_GET_NOWNODE_VALUE;
            case 'BASELIST_NOWNODE_IS_LAST':
                return Blocks.BASELIST_NOWNODE_IS_LAST;
            case 'BASELIST_GET_NEXT_NODE':
                return Blocks.BASELIST_GET_NEXT_NODE;
            case 'BASENODE_GET_VALUE':
                return Blocks.BASENODE_GET_VALUE;
        }
        return Blocks.ERROR;
    }
}
