import { Blocks, OperBlocks } from './const';
import Operate from './operate';
import Helper from './helper';
import BaseList from '../lib/list/baseList';
import _ from 'lodash';
import Change from './change';
import ListNode from '../lib/list/listNode';
import Storage from '../lib/widget/const/storage';
export class Complie {
    /**
     * 获得变量
     *
     * @static
     * @param {{[key: string]: any}} varSet
     * @returns {{[key: string]: any}}
     * @memberof Complie
     */
    static getVar(varSet) {
        const varList = {
            var: {},
            forLoopVar: {},
        };
        for (const key in varSet.var) {
            if (varSet.var.hasOwnProperty(key)) {
                varList.var[key] = 0;
            }
        }
        for (const type in varSet.sp_var) {
            if (varSet.sp_var.hasOwnProperty(type)) {
                varList[type] = {};
                for (const key in varSet.sp_var[type]) {
                    if (varSet.sp_var[type].hasOwnProperty(key)) {
                        varList[type][key] = 0;
                    }
                }
            }
        }
        return varList;
    }
    /**
     * 编译
     *
     * @static
     * @param {OperateList} opList
     * @param {{[key: string]: any}} code
     * @param {{[key: string]: any}} varList
     * @returns {*}
     * @memberof Complie
     */
    static explain(opList, code, varList) {
        let left;
        let right;
        let repeatTime;
        let start;
        let end;
        let step;
        let varName;
        let status;
        let value;
        let count;
        let text;
        let subString;
        let index;
        let list;
        let flag;
        let node;
        let baseList;
        let change;
        let length;
        let conditionNumber;
        if (code === undefined) {
            return Blocks.ERROR;
        }
        switch (Helper.complie(code.block)) {
            case Blocks.IF:
                conditionNumber = code.condition_number || 0;
                for (let i = 0; i < conditionNumber; ++i) {
                    if (typeof code.conditions[i][0] === 'boolean') {
                        if (code.conditions[i][0] === true) {
                            opList.insert(new Operate(OperBlocks.IF, code.comment_id + String(i), []));
                            this.explain(opList, code.conditions[i][1], varList);
                            break;
                        }
                    }
                    else {
                        if (this.explain(opList, code.conditions[i][0], varList)) {
                            opList.insert(new Operate(OperBlocks.IF, code.comment_id + String(i), []));
                            this.explain(opList, code.conditions[i][1], varList);
                            break;
                        }
                    }
                }
                break;
            case Blocks.COMPARE:
                left = this.explain(opList, code.left, varList);
                right = this.explain(opList, code.right, varList);
                if (typeof left !== typeof right) {
                    left = String(left);
                    right = String(right);
                }
                switch (code.type) {
                    case '<':
                        return left < right;
                    case '<=':
                        return left <= right;
                    case '>':
                        return left > right;
                    case '>=':
                        return left >= right;
                    case '==':
                        return left === right;
                    case '!=':
                        return left !== right;
                    default:
                        return false;
                }
            case Blocks.LOGIC_OPERATION:
                left = Boolean(this.explain(opList, code.left, varList));
                if (code.type !== 'NOT') {
                    right = Boolean(this.explain(opList, code.right, varList));
                }
                switch (code.type) {
                    case 'AND':
                        return left && right;
                    case 'OR':
                        return left || right;
                    case 'NOT':
                        return !left;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.BOOLEAN:
                if (code.value === true) {
                    return true;
                }
                return false;
            case Blocks.LOGIC_NULL:
                return null;
            case Blocks.LOOP_REPEAT:
                if (typeof code.times === 'number') {
                    repeatTime = code.times;
                }
                else {
                    repeatTime = Number(this.explain(opList, code.times, varList));
                }
                for (let i = 0; i < repeatTime; ++i) {
                    opList.insert(new Operate(OperBlocks.LOOP_REPEAT, code.comment_id, []));
                    status = this.explain(opList, code.branch, varList);
                    if (status === Blocks.BREAK) {
                        break;
                    }
                    else if (status === Blocks.CONTINUE) {
                        opList.insert(new Operate(OperBlocks.LOOP_REPEAT, code.comment_id, []));
                        continue;
                    }
                }
                break;
            case Blocks.LOOP_WHILE:
                repeatTime = 0;
                // eslint-disable-next-line
                while (true) {
                    ++repeatTime;
                    if (typeof code.condition === 'boolean') {
                        if (code.condition === true) {
                            opList.insert(new Operate(OperBlocks.LOOP_WHILE, code.comment_id, []));
                            status = this.explain(opList, code.branch, varList);
                            if (status === Blocks.BREAK) {
                                break;
                            }
                            else if (status === Blocks.CONTINUE) {
                                continue;
                            }
                        }
                        else {
                            opList.insert(new Operate(OperBlocks.LOOP_WHILE, code.comment_id, []));
                            break;
                        }
                    }
                    else {
                        if (Boolean(this.explain(opList, code.condition, varList)) === true) {
                            opList.insert(new Operate(OperBlocks.LOOP_WHILE, code.comment_id, []));
                            status = this.explain(opList, code.branch, varList);
                            if (status === Blocks.BREAK) {
                                break;
                            }
                            else if (status === Blocks.CONTINUE) {
                                continue;
                            }
                        }
                        else {
                            opList.insert(new Operate(OperBlocks.LOOP_WHILE, code.comment_id, []));
                            break;
                        }
                    }
                    if (repeatTime > this.MAX_REPEAT_TIME) {
                        return Blocks.ERROR;
                    }
                }
                break;
            case Blocks.LOOP_UNTIL:
                repeatTime = 0;
                // eslint-disable-next-line
                while (true) {
                    ++repeatTime;
                    if (typeof code.condition === 'boolean') {
                        if (code.condition === false) {
                            opList.insert(new Operate(OperBlocks.LOOP_UNTIL, code.comment_id, []));
                            status = this.explain(opList, code.branch, varList);
                            if (status === Blocks.BREAK) {
                                break;
                            }
                            else if (status === Blocks.CONTINUE) {
                                continue;
                            }
                        }
                        else {
                            opList.insert(new Operate(OperBlocks.LOOP_UNTIL, code.comment_id, []));
                            break;
                        }
                    }
                    else {
                        if (Boolean(this.explain(opList, code.condition, varList)) === false) {
                            opList.insert(new Operate(OperBlocks.LOOP_UNTIL, code.comment_id, []));
                            status = this.explain(opList, code.branch, varList);
                            if (status === Blocks.BREAK) {
                                break;
                            }
                            else if (status === Blocks.CONTINUE) {
                                continue;
                            }
                        }
                        else {
                            opList.insert(new Operate(OperBlocks.LOOP_UNTIL, code.comment_id, []));
                            break;
                        }
                    }
                    if (repeatTime > this.MAX_REPEAT_TIME) {
                        return Blocks.ERROR;
                    }
                }
                break;
            case Blocks.LOOP_FOR:
                start = Number(this.explain(opList, code.var_start, varList)) || 0;
                end = Number(this.explain(opList, code.var_end, varList)) || 0;
                step = Number(this.explain(opList, code.var_step, varList)) || 1;
                varName = String(code.var_name);
                for (varList.forLoopVar[varName] = start; varList.forLoopVar[varName] < end; varList.forLoopVar[varName] += step) {
                    opList.insert(new Operate(OperBlocks.LOOP_FOR, code.comment_id, []));
                    status = this.explain(opList, code.branch, varList);
                    if (status === Blocks.BREAK) {
                        break;
                    }
                    else if (status === Blocks.CONTINUE) {
                        continue;
                    }
                }
                opList.insert(new Operate(OperBlocks.LOOP_FOR, code.comment_id, []));
                break;
            case Blocks.LOOP_FLOW_CONTROLS:
                opList.insert(new Operate(OperBlocks.LOOP_FLOW_CONTROLS, code.comment_id, []));
                if (code.type === 'BREAK') {
                    return Blocks.BREAK;
                }
                else if (code.type === 'CONTINUE') {
                    return Blocks.CONTINUE;
                }
                else {
                    return Blocks.ERROR;
                }
            case Blocks.NUMBER:
                return Number(code.value) || 0;
            case Blocks.MATH_OPERATOR:
                left = Number(this.explain(opList, code.left, varList)) || 0;
                right = Number(this.explain(opList, code.right, varList)) || 0;
                switch (code.type) {
                    case 'ADD':
                        return left + right;
                    case 'MINUS':
                        return left - right;
                    case 'MULTIPLY':
                        return left * right;
                    case 'DIVIDE':
                        if (right === 0) {
                            return Blocks.ERROR;
                        }
                        return left / right;
                    case 'POWER':
                        return Math.pow(left, right);
                    case 'MOD':
                        if (right === 0) {
                            return Blocks.ERROR;
                        }
                        return left % right;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.MATH_FUNCTION:
                value = Number(this.explain(opList, code.value, varList)) || 0;
                switch (code.type) {
                    case 'ROOT':
                        return Math.sqrt(value);
                    case 'ABS':
                        return Math.abs(value);
                    case 'NEG':
                        return -1 * value;
                    case 'LN':
                        return Math.log(value);
                    case 'LOG10':
                        return Math.log10(value);
                    case 'EXP':
                        return Math.exp(value);
                    case 'POW10':
                        return Math.pow(10, value);
                    case 'ROUND':
                        return Math.round(value);
                    case 'ROUNDUP':
                        return Math.ceil(value);
                    case 'ROUNDDOWN':
                        return Math.floor(value);
                    case 'SIN':
                        return Math.sin(value / 180 * Math.PI);
                    case 'COS':
                        return Math.cos(value / 180 * Math.PI);
                    case 'TAN':
                        return Math.tan(value / 180 * Math.PI);
                    case 'ASIN':
                        return Math.asin(value) / Math.PI * 180;
                    case 'ACOS':
                        return Math.acos(value) / Math.PI * 180;
                    case 'ATAN':
                        return Math.atan(value) / Math.PI * 180;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.MATH_CONSTANT:
                switch (code.type) {
                    case 'PI':
                        return Math.PI;
                    case 'E':
                        return Math.E;
                    case 'GOLDEN_RATIO':
                        return (1 + Math.sqrt(5)) / 2;
                    case 'SQRT2':
                        return Math.SQRT2;
                    case 'SQRT1_2':
                        return Math.SQRT1_2;
                    case 'INFINITY':
                        return Infinity;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.MATH_NUMBER_CHECK:
                value = Number(this.explain(opList, code.value1, varList)) || 0;
                switch (code.type) {
                    case 'PRIME':
                        return Helper.isPrime(value);
                    case 'EVEN':
                        return value % 2 === 0;
                    case 'ODD':
                        return value % 2 === 1;
                    case 'WHOLE':
                        return value % 1 === 0;
                    case 'POSITIVE':
                        return value > 0;
                    case 'NEGATIVE':
                        return value < 0;
                    case 'DIVISIBLE_BY':
                        right = Number(this.explain(opList, code.value2, varList)) || 1;
                        return value % right === 0;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.MATH_RANDOM:
                switch (code.type) {
                    case 'INT':
                        left = Number(this.explain(opList, code.min, varList)) || 0;
                        right = Number(this.explain(opList, code.max, varList)) || 1;
                        return Helper.randomInt(left, right);
                    case 'FLOAT':
                        return Math.random();
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.TEXT:
                return String(code.value);
            case Blocks.TEXT_JOIN:
                text = [];
                count = Number(code.text_number) || 0;
                for (let i = 0; i < count; ++i) {
                    text.push(String(this.explain(opList, code.texts[i], varList)));
                }
                return text.join('');
            case Blocks.TEXT_LENGTH:
                text = String(this.explain(opList, code.text, varList)) || '';
                return text.length;
            case Blocks.TEXT_ISEMPTY:
                text = String(this.explain(opList, code.text, varList)) || '';
                return text.length === 0;
            case Blocks.TEXT_INDEX_OF:
                text = String(this.explain(opList, code.text, varList)) || '';
                subString = String(this.explain(opList, code.subString, varList)) || '';
                switch (code.type) {
                    case 'FIRST':
                        return text.indexOf(subString);
                    case 'LAST':
                        return text.lastIndexOf(subString);
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.TEXT_CHAR_AT:
                index = Number(this.explain(opList, code.index, varList)) || 0;
                text = String(this.explain(opList, code.text, varList)) || '';
                switch (code.type) {
                    case 'FIRST':
                        return text.charAt(0);
                    case 'LAST':
                        return text.slice(-1);
                    case 'FROM_START':
                        return text.charAt(index - 1);
                    case 'FROM_END':
                        return text.slice(-1 * index).charAt(0);
                    case 'RANDOM':
                        return text.charAt(Helper.randomInt(0, text.length - 1));
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.TEXT_GET_SUBSTRING:
                start = Number(this.explain(opList, code.index1, varList)) || 0;
                end = Number(this.explain(opList, code.index2, varList)) || 1;
                text = String(this.explain(opList, code.text, varList)) || '';
                switch (code.type1) {
                    case 'FIRST':
                        start = 0;
                        break;
                    case 'FROM_START':
                        start = start - 1;
                        break;
                    case 'FROM_END':
                        start = -1 * start;
                        break;
                    default:
                        return Blocks.ERROR;
                }
                switch (code.type2) {
                    case 'LAST':
                        end = text.length;
                        break;
                    case 'FROM_START':
                        break;
                    case 'FROM_END':
                        end = -1 * (end - 1);
                        break;
                    default:
                        return Blocks.ERROR;
                }
                return text.slice(start, end);
            case Blocks.TEXT_CHANGE_CASE:
                text = String(this.explain(opList, code.text, varList)) || '';
                switch (code.type) {
                    case 'UPPERCASE':
                        return text.toUpperCase();
                    case 'LOWERCASE':
                        return text.toLowerCase();
                    case 'TITLECASE':
                        return Helper.titleCase(text);
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.VAR_GET:
                if (varList.var === undefined ||
                    varList.var[code.var_name] === undefined) {
                    return Blocks.ERROR;
                }
                return varList.var[code.var_name];
            case Blocks.VAR_SET:
                if (varList.var === undefined ||
                    varList.var[code.var_name] === undefined) {
                    return Blocks.ERROR;
                }
                value = this.explain(opList, code.value, varList) || 0;
                change = new Change('var', code.var_name, _.cloneDeep(varList.var[code.var_name]), _.cloneDeep(value));
                varList.var[code.var_name] = value;
                opList.insert(new Operate(OperBlocks.VAR_SET, code.comment_id, [change]));
                break;
            case Blocks.VAR_ADD:
                if (varList.var === undefined ||
                    varList.var[code.var_name] === undefined) {
                    return Blocks.ERROR;
                }
                value = this.explain(opList, code.change, varList) || 0;
                change = new Change('var', code.var_name, _.cloneDeep(varList.var[code.var_name]), '');
                varList.var[code.var_name] += value;
                change.after = _.cloneDeep(varList.var[code.var_name]);
                opList.insert(new Operate(OperBlocks.VAR_ADD, code.comment_id, [change]));
                break;
            case Blocks.LIST_CREATE_EMPTY:
                return [];
            case Blocks.LIST_CREATE_WITH:
                count = Number(code.item_num) || 0;
                list = [];
                for (let i = 0; i < count; ++i) {
                    list.push(this.explain(opList, code.items[i], varList));
                }
                return list;
            case Blocks.LIST_CREATE_REPEAT:
                list = [];
                count = Number(this.explain(opList, code.repeat_times, varList)) || 0;
                for (let i = 0; i < count; ++i) {
                    list.push(this.explain(opList, code.item, varList));
                }
                return list;
            case Blocks.LIST_LENGTH:
                list = this.explain(opList, code.list, varList) || [];
                return list.length;
            case Blocks.LIST_IS_EMPTY:
                list = this.explain(opList, code.list, varList) || [];
                return list.length === 0;
            case Blocks.LIST_INDEX_OF:
                list = this.explain(opList, code.list, varList) || [];
                value = this.explain(opList, code.value, varList) || [];
                switch (code.type) {
                    case 'FIRST':
                        return list.indexOf(value) + 1;
                    case 'LAST':
                        return list.lastIndexOf(value) + 1;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.LIST_GET_INDEX:
                list = this.explain(opList, code.list, varList) || [];
                index = Number(this.explain(opList, code.index, varList)) || 0;
                switch (code.type) {
                    case 'FIRST':
                        index = 0;
                        break;
                    case 'LAST':
                        index = list.length - 1;
                        break;
                    case 'FROM_START':
                        index = index - 1;
                        break;
                    case 'FROM_END':
                        index = list.length - index;
                        break;
                    case 'RANDOM':
                        index = Helper.randomInt(0, list.length - 1);
                        break;
                    default:
                        return Blocks.ERROR;
                }
                change = new Change('var', '', _.cloneDeep(list), '');
                if (code.mode !== 'GET') {
                    if (code.list.block === 'VAR_GET') {
                        change.vName = code.list.var_name;
                    }
                    opList.insert(new Operate(OperBlocks.LIST_GET_INDEX, code.comment_id, [change]));
                }
                switch (code.mode) {
                    case 'GET':
                        return list[index];
                    case 'GET_REMOVE':
                        value = list.splice(index, 1)[0];
                        change.after = _.cloneDeep(list);
                        return value;
                    case 'REMOVE':
                        list.splice(index, 1);
                        change.after = _.cloneDeep(list);
                        return;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.LIST_SET_INDEX:
                list = this.explain(opList, code.list, varList) || [];
                index = Number(this.explain(opList, code.index, varList)) || 0;
                value = this.explain(opList, code.value, varList);
                /**
                 * flag是为了体现insert和set的区别
                 * index的基准为set
                 * 如果flag为true就要+1
                 */
                flag = false;
                switch (code.type) {
                    case 'FIRST':
                        index = 0;
                        break;
                    case 'LAST':
                        index = list.length - 1;
                        flag = true;
                        break;
                    case 'FROM_START':
                        index = index - 1;
                        break;
                    case 'FROM_END':
                        flag = true;
                        index = list.length - index;
                        break;
                    case 'RANDOM':
                        if (code.mode === 'INSERT') {
                            index = Helper.randomInt(0, list.length);
                        }
                        else {
                            index = Helper.randomInt(0, list.length - 1);
                        }
                        break;
                    default:
                        return Blocks.ERROR;
                }
                change = new Change('var', '', _.cloneDeep(list), '');
                if (Helper.complie(code.list.block) === Blocks.VAR_GET) {
                    change.vName = code.list.var_name;
                }
                switch (code.mode) {
                    case 'SET':
                        list[index] = value;
                        break;
                    case 'INSERT':
                        index += flag ? 1 : 0;
                        list.splice(index, 0, value);
                        break;
                    default:
                        return Blocks.ERROR;
                }
                change.after = _.cloneDeep(list);
                opList.insert(new Operate(OperBlocks.LIST_GET_INDEX, code.comment_id, [change]));
                break;
            case Blocks.BASELIST_CREATE_FROM:
                value = this.explain(opList, code.value, varList);
                baseList = new BaseList();
                switch (code.type) {
                    case 'RANDOM':
                        baseList.randomList();
                        break;
                    case 'RANDOM_WITH_NODE_NUMBER':
                        baseList.randomListWithNodeNumber(Number(value) || 0);
                        break;
                    case 'FROM_LIST':
                        list = [];
                        length = value.length;
                        for (let i = 0; i < length; ++i) {
                            list.push(String(value[i]));
                        }
                        baseList.userDefineList(list);
                        break;
                    default:
                        return Blocks.ERROR;
                }
                Storage.animation.clearAnimation();
                baseList.addToAnimation();
                return baseList;
            case Blocks.BASELIST_SET_POSITION:
                left = Number(this.explain(opList, code.x, varList)) || 0;
                right = Number(this.explain(opList, code.y, varList)) || 0;
                baseList = this.explain(opList, code.list, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                Storage.animation.clearAnimation();
                baseList.setHeadPosition(left, right);
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                opList.insert(new Operate(OperBlocks.BASELIST_SET_POSITION, code.comment_id, [change]));
                break;
            case Blocks.BASELIST_SET:
                varName = String(code.var_name);
                value = this.explain(opList, code.value, varList);
                change = new Change('baseList', varName, _.cloneDeep(varList.baseList[varName]), _.cloneDeep(value));
                varList.baseList[varName] = value;
                opList.insert(new Operate(OperBlocks.BASELIST_SET, code.comment_id, [change]));
                break;
            case Blocks.BASELIST_GET:
                varName = String(code.var_name);
                return varList.baseList[varName];
            case Blocks.BASENODE_GET:
                varName = String(code.var_name);
                return varList.baseNode[varName];
            case Blocks.BASENODE_SET:
                varName = String(code.var_name);
                value = this.explain(opList, code.node, varList);
                if (typeof value === 'string' || typeof value === 'number') {
                    value = new ListNode(String(value));
                }
                change = new Change('baseNode', varName, _.cloneDeep(varList.baseNode[varName]), _.cloneDeep(value));
                opList.insert(new Operate(OperBlocks.BASENODE_SET, code.comment_id, [change]));
                varList.baseNode[varName] = value;
                break;
            case Blocks.BASELIST_GET_NOW_NODE:
                baseList = this.explain(opList, code.list, varList);
                return baseList.now();
            case Blocks.BASELIST_REMOVE_NODE_ONVIEW:
                baseList = this.explain(opList, code.list, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_REMOVE_NODE_ONVIEW, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.removeNode();
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_REMOVE_NODE_REAL:
                baseList = this.explain(opList, code.list, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_REMOVE_NODE_REAL, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.trueRemoveNode();
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_MOVE_TO_NEXT:
                baseList = this.explain(opList, code.list, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_MOVE_TO_NEXT, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.moveToNxt();
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_NOW_POINT_TO_OTHER:
                baseList = this.explain(opList, code.list, varList);
                value = this.explain(opList, code.node, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_NOW_POINT_TO_OTHER, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.nowShowNxtPointTo(value);
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_NEW_POINT_TO_OTHER:
                baseList = this.explain(opList, code.list, varList);
                value = this.explain(opList, code.node, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_NEW_POINT_TO_OTHER, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.newShowNxtPointTo(value);
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_ADD_NEW_NODE_TRUE:
                baseList = this.explain(opList, code.list, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_ADD_NEW_NODE_TRUE, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.trueAddNode();
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            case Blocks.BASELIST_GET_NEW_NODE:
                baseList = this.explain(opList, code.list, varList);
                return baseList.getNewNode();
            case Blocks.BASELIST_GET_NEXT_NODE:
                baseList = this.explain(opList, code.list, varList);
                return baseList.now().nxtNode;
            case Blocks.BASENODE_GET_VALUE:
                node = this.explain(opList, code.node, varList);
                return node.getVal('val');
            case Blocks.BASELIST_GET_NODE_NUMBER:
                baseList = this.explain(opList, code.list, varList);
                return baseList.nodeNumber;
            case Blocks.BASELIST_GET_NOWNODE_VALUE:
                baseList = this.explain(opList, code.list, varList);
                return baseList.now().getVal('val');
            case Blocks.BASELIST_NOWNODE_IS_LAST:
                baseList = this.explain(opList, code.list, varList);
                return baseList.now().nxtNode === null;
            case Blocks.BASELIST_CREATE_NEW_NODE:
                baseList = this.explain(opList, code.list, varList);
                value = this.explain(opList, code.node, varList);
                change = new Change('baseList', '', _.cloneDeep(baseList), '');
                if (Helper.complie(code.list.block) === Blocks.BASELIST_GET) {
                    change.vName = code.list.var_name;
                }
                opList.insert(new Operate(OperBlocks.BASELIST_CREATE_NEW_NODE, code.comment_id, [change]));
                Storage.animation.clearAnimation();
                baseList.createNewNode(value);
                baseList.addToAnimation();
                change.after = _.cloneDeep(baseList);
                break;
            default:
                return Blocks.ERROR;
        }
        if (code.child !== undefined) {
            return this.explain(opList, code.child, varList);
        }
        return null;
    }
}
Complie.MAX_REPEAT_TIME = 1000;
