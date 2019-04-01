import { Blocks } from './const';
import Helper from './helper';
export default class Comment {
    /**
     * 获得伪代码
     *
     * @static
     * @param {{[key: string]: any}} code
     * @param {Array<{[key: string]: any}>} commentList
     * @param {number} [indend=0]
     * @returns
     * @memberof Comment
     */
    static getComment(code, commentList, indend = 0) {
        let subComment;
        let leftComment;
        let rightComment;
        let midComment;
        let otherComment;
        let count;
        let conditionNumber;
        if (code === undefined) {
            return Blocks.ERROR;
        }
        subComment = Helper.getIndend(indend);
        switch (Helper.complie(code.block)) {
            case Blocks.IF:
                conditionNumber = code.condition_number || 0;
                for (let i = 0; i < conditionNumber; ++i) {
                    if (i === conditionNumber - 1 && typeof code.conditions[i][0] === 'boolean') {
                        subComment += '否则';
                    }
                    else {
                        subComment += (code.comment || '如果') + this.getComment(code.conditions[i][0], []);
                    }
                    commentList.push({
                        id: code.comment_id + String(i),
                        comment: subComment,
                    });
                    this.getComment(code.conditions[i][1], commentList, indend + 1);
                }
                break;
            case Blocks.COMPARE:
                midComment = code.comment;
                leftComment = this.getComment(code.left, []);
                rightComment = this.getComment(code.right, []);
                if (midComment === '') {
                    switch (code.type) {
                        case '>':
                            midComment = '大于';
                            break;
                        case '>=':
                            midComment = '大于等于';
                            break;
                        case '<':
                            midComment = '小于';
                            break;
                        case '<=':
                            midComment = '小于等于';
                            break;
                        case '==':
                            midComment = '等于';
                            break;
                        case '!=':
                            midComment = '不等于';
                            break;
                        default:
                            return Blocks.ERROR;
                    }
                }
                return subComment + leftComment + midComment + rightComment;
            case Blocks.LOGIC_OPERATION:
                leftComment = this.getComment(code.left, []);
                rightComment = '';
                if (code.type !== 'NOT') {
                    rightComment = this.getComment(code.right, []);
                }
                else {
                    rightComment = leftComment;
                    leftComment = '';
                }
                midComment = code.comment;
                if (midComment === '') {
                    switch (code.type) {
                        case 'AND':
                            midComment = '并且';
                            break;
                        case 'OR':
                            midComment = '或者';
                            break;
                        case 'NOT':
                            midComment = '非';
                            break;
                        default:
                            return Blocks.ERROR;
                    }
                }
                return subComment + leftComment + midComment + rightComment;
            case Blocks.BOOLEAN:
                if (code.comment !== '') {
                    return subComment + code.comment;
                }
                if (code.value === true) {
                    return subComment + '真';
                }
                return subComment + '假';
            case Blocks.LOGIC_NULL:
                if (code.comment !== '') {
                    return subComment + code.comment;
                }
                return subComment + '空';
            case Blocks.LOOP_REPEAT:
                subComment += code.comment || '重复';
                if (typeof code.times === 'number') {
                    rightComment = String(code.times);
                }
                else {
                    rightComment = this.getComment(code.times, []);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + rightComment + '次',
                });
                this.getComment(code.branch, commentList, indend + 1);
                break;
            case Blocks.LOOP_WHILE:
                subComment += code.comment || '循环当';
                if (typeof code.condition === 'boolean') {
                    if (code.condition === false) {
                        rightComment = '假';
                    }
                    else {
                        rightComment = '真';
                    }
                }
                else {
                    rightComment = this.getComment(code.condition, []);
                }
                rightComment += '时';
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + rightComment,
                });
                this.getComment(code.branch, commentList, indend + 1);
                break;
            case Blocks.LOOP_UNTIL:
                subComment += code.comment || '循环直到';
                if (typeof code.condition === 'boolean') {
                    if (code.condition === false) {
                        rightComment = '假';
                    }
                    else {
                        rightComment = '真';
                    }
                }
                else {
                    rightComment = this.getComment(code.condition, []);
                }
                rightComment += '时';
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + rightComment,
                });
                this.getComment(code.branch, commentList, indend + 1);
                break;
            case Blocks.LOOP_FOR:
                subComment += code.comment || '循环从';
                subComment += this.getComment(code.var_start, []) || '0';
                subComment += '到';
                subComment += this.getComment(code.var_end, []) || '0';
                subComment += '步长';
                subComment += this.getComment(code.var_step, []) || '1';
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                this.getComment(code.branch, commentList, indend + 1);
                break;
            case Blocks.LOOP_FLOW_CONTROLS:
                midComment = code.comment;
                if (midComment === '') {
                    if (code.type === 'BREAK') {
                        midComment = '结束循环';
                    }
                    else if (code.type === 'CONTINUE') {
                        midComment = '跳过当前循环';
                    }
                    else {
                        return Blocks.ERROR;
                    }
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + midComment,
                });
                return;
            case Blocks.NUMBER:
                return subComment + (code.comment || String(code.value || 0));
            case Blocks.MATH_OPERATOR:
                leftComment = this.getComment(code.left, []);
                rightComment = this.getComment(code.right, []);
                midComment = code.comment;
                if (midComment === '') {
                    switch (code.type) {
                        case 'ADD':
                            midComment = '加';
                            break;
                        case 'MINUS':
                            midComment = '减';
                            break;
                        case 'MULTIPLY':
                            midComment = '乘';
                            break;
                        case 'DIVIDE':
                            midComment = '除';
                            break;
                        case 'POWER':
                            midComment = '乘方';
                            break;
                        case 'MOD':
                            midComment = '取模';
                            break;
                        default:
                            return Blocks.ERROR;
                    }
                }
                return subComment + leftComment + midComment + rightComment;
            case Blocks.MATH_FUNCTION:
                leftComment = this.getComment(code.value, []) || '0';
                midComment = code.comment;
                if (midComment === '') {
                    switch (code.type) {
                        case 'ROOT':
                            midComment = '的平方根';
                            break;
                        case 'ABS':
                            midComment = '的绝对值';
                            break;
                        case 'NEG':
                            midComment = '的负数';
                            break;
                        case 'LN':
                            midComment = '的自然对数';
                            break;
                        case 'LOG10':
                            midComment = '的常用对数';
                            break;
                        case 'EXP':
                            midComment = '以 e 为底的指数';
                            break;
                        case 'POW10':
                            midComment = '以 10 为底的指数';
                            break;
                        case 'ROUND':
                            midComment = '的四舍五入';
                            break;
                        case 'ROUNDUP':
                            midComment = '的向上取整';
                            break;
                        case 'ROUNDDOWN':
                            midComment = '的向下取整';
                            break;
                        case 'SIN':
                            midComment = '的正弦值';
                            break;
                        case 'COS':
                            midComment = '的余弦值';
                            break;
                        case 'TAN':
                            midComment = '的正切值';
                            break;
                        case 'ASIN':
                            midComment = '的反正弦值';
                            break;
                        case 'ACOS':
                            midComment = '的反余弦值';
                            break;
                        case 'ATAN':
                            midComment = '的反正切值';
                            break;
                        default:
                            return Blocks.ERROR;
                    }
                }
                return subComment + leftComment + midComment;
            case Blocks.MATH_CONSTANT:
                subComment = code.comment;
                if (subComment === '') {
                    switch (code.type) {
                        case 'PI':
                            return '圆周率';
                        case 'E':
                            return 'E';
                        case 'GOLDEN_RATIO':
                            return '黄金分割率';
                        case 'SQRT2':
                            return '2 的平方根';
                        case 'SQRT1_2':
                            return '1 / 2 的平方根';
                        case 'INFINITY':
                            return '无穷';
                        default:
                            return Blocks.ERROR;
                    }
                }
                return subComment;
            case Blocks.MATH_NUMBER_CHECK:
                leftComment = this.getComment(code.value1, []) || '0';
                midComment = code.comment;
                rightComment = '';
                if (code.type === 'DIVISIBLE_BY') {
                    rightComment = this.getComment(code.value2, []) || '1';
                }
                if (code.comment === '') {
                    switch (code.type) {
                        case 'PRIME':
                            subComment = subComment + leftComment + '是否是质数';
                            break;
                        case 'EVEN':
                            subComment = subComment + leftComment + '是否是偶数';
                            break;
                        case 'ODD':
                            subComment = subComment + leftComment + '是否是奇数';
                            break;
                        case 'WHOLE':
                            subComment = subComment + leftComment + '是否是整数';
                            break;
                        case 'POSITIVE':
                            subComment = subComment + leftComment + '是否是正数';
                            break;
                        case 'NEGATIVE':
                            subComment = subComment + leftComment + '是否是负数';
                            break;
                        case 'DIVISIBLE_BY':
                            subComment = subComment + leftComment + '能否被' + rightComment + '整除';
                            break;
                        default:
                            return Blocks.ERROR;
                    }
                }
                else {
                    subComment = subComment + leftComment + midComment + rightComment;
                }
                return subComment;
            case Blocks.MATH_RANDOM:
                midComment = code.comment;
                switch (code.type) {
                    case 'INT':
                        leftComment = this.getComment(code.min, []) || '0';
                        rightComment = this.getComment(code.max, []) || '1';
                        if (midComment === '') {
                            return subComment + leftComment + '到' + rightComment + '的随机数';
                        }
                        else {
                            return subComment + leftComment + midComment + rightComment;
                        }
                    case 'FLOAT':
                        if (midComment === '') {
                            return subComment + '0 到 1 的随机小数';
                        }
                        else {
                            return subComment + midComment;
                        }
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.TEXT:
                return code.comment || code.value || '文本的值';
            case Blocks.TEXT_JOIN:
                midComment = code.comment || '将文本 ';
                count = Number(code.text_number) || 0;
                for (let i = 0; i < count; ++i) {
                    midComment += this.getComment(code.texts[i], []);
                    midComment += ' ';
                }
                return subComment + midComment + '合并';
            case Blocks.TEXT_LENGTH:
                midComment = code.comment || '获得文本 ';
                midComment += this.getComment(code.text, []);
                return subComment + midComment + ' 的长度';
            case Blocks.TEXT_ISEMPTY:
                midComment = code.comment || '是否为空';
                leftComment = this.getComment(code.text, []);
                return subComment + leftComment + midComment;
            case Blocks.TEXT_INDEX_OF:
                midComment = code.comment;
                leftComment = this.getComment(code.text, []);
                rightComment = this.getComment(code.subString, []);
                switch (code.type) {
                    case 'FIRST':
                        if (midComment === '') {
                            subComment = subComment + '从 ' + leftComment + ' 中找到第一次出现的 ' + rightComment;
                        }
                        else {
                            subComment = subComment + leftComment + midComment + rightComment;
                        }
                        break;
                    case 'LAST':
                        if (midComment === '') {
                            subComment = subComment + '从 ' + leftComment + ' 中找到最后一次出现的 ' + rightComment;
                        }
                        else {
                            subComment = subComment + leftComment + midComment + rightComment;
                        }
                        break;
                    default:
                        return Blocks.ERROR;
                }
                return subComment;
            case Blocks.TEXT_CHAR_AT:
                midComment = code.comment;
                leftComment = this.getComment(code.text, []) || '';
                rightComment = this.getComment(code.index, []) || '';
                switch (code.type) {
                    case 'FIRST':
                        if (midComment === '') {
                            subComment = subComment + leftComment + ' 中第一个字符';
                        }
                        else {
                            subComment = subComment + leftComment + midComment;
                        }
                        break;
                    case 'LAST':
                        if (midComment === '') {
                            subComment = subComment + leftComment + ' 中最后一个字符';
                        }
                        else {
                            subComment = subComment + leftComment + midComment;
                        }
                        break;
                    case 'FROM_START':
                        if (midComment === '') {
                            subComment = subComment + leftComment + ' 中从前往后第 ' + rightComment + ' 个字符';
                        }
                        else {
                            subComment = subComment + leftComment + midComment + rightComment;
                        }
                        break;
                    case 'FROM_END':
                        if (midComment === '') {
                            subComment = subComment + leftComment + ' 中从后往前第 ' + rightComment + ' 个字符';
                        }
                        else {
                            subComment = subComment + leftComment + midComment + rightComment;
                        }
                        break;
                    case 'RANDOM':
                        if (midComment === '') {
                            subComment = subComment + leftComment + ' 中随机一个字符';
                        }
                        else {
                            subComment = subComment + leftComment + midComment;
                        }
                        break;
                    default:
                        return Blocks.ERROR;
                }
                break;
            case Blocks.TEXT_GET_SUBSTRING:
                midComment = code.comment;
                otherComment = this.getComment(code.text, []) || '';
                leftComment = this.getComment(code.index1, []) || '0';
                rightComment = this.getComment(code.index2, []) || '1';
                if (midComment !== '') {
                    return subComment + otherComment + leftComment + midComment + rightComment;
                }
                subComment += '从';
                subComment += otherComment;
                subComment += '获取子串从';
                switch (code.type1) {
                    case 'FIRST':
                        subComment += '第一个到';
                        break;
                    case 'FROM_START':
                        subComment += '第' + leftComment + '个到';
                        break;
                    case 'FROM_END':
                        subComment += '倒数第' + leftComment + '个到';
                        break;
                    default:
                        return Blocks.ERROR;
                }
                switch (code.type2) {
                    case 'LAST':
                        subComment += '最后一个';
                        break;
                    case 'FROM_START':
                        subComment += '第' + rightComment + '个';
                        break;
                    case 'FROM_END':
                        subComment += '倒数第' + rightComment + '个';
                        break;
                    default:
                        return Blocks.ERROR;
                }
                return subComment;
            case Blocks.TEXT_CHANGE_CASE:
                leftComment = this.getComment(code.text, []);
                midComment = code.comment;
                if (midComment !== '') {
                    return leftComment + midComment;
                }
                switch (code.type) {
                    case 'UPPERCASE':
                        return '将 ' + leftComment + ' 转为小写';
                    case 'LOWERCASE':
                        return '将 ' + leftComment + ' 转为大写';
                    case 'TITLECASE':
                        return '将 ' + leftComment + ' 转为首字母大写';
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.VAR_GET:
                subComment += (code.comment || ('变量 ' + code.var_name));
                return subComment;
            case Blocks.VAR_SET:
                rightComment = this.getComment(code.value, []);
                midComment = code.comment || ('将变量 ' + code.var_name + ' 赋值为 ');
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + midComment + rightComment,
                });
                break;
            case Blocks.VAR_ADD:
                rightComment = this.getComment(code.value, []);
                midComment = code.comment || ('将变量 ' + code.var_name + ' 增加 ');
                commentList.push({
                    id: code.comment_id,
                    comment: subComment + midComment + rightComment,
                });
                break;
            case Blocks.LIST_CREATE_EMPTY:
                return subComment + (code.comment || '创建空列表');
            case Blocks.LIST_CREATE_WITH:
                count = Number(code.item_num) || 0;
                midComment = code.comment;
                rightComment = '';
                for (let i = 0; i < count; ++i) {
                    rightComment += ' ' + this.getComment(code.item[i], []);
                }
                return subComment + midComment + rightComment;
            case Blocks.LIST_CREATE_REPEAT:
                midComment = code.comment;
                count = this.getComment(code.repeat_times, []) || '0';
                rightComment = this.getComment(code.item, []);
                if (midComment === '') {
                    return subComment + '通过重复 ' + rightComment + ' ' + count + ' 次来创建列表';
                }
                else {
                    return subComment + midComment + rightComment + count;
                }
            case Blocks.LIST_LENGTH:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + '列表 ' + leftComment + ' 的长度';
                }
                else {
                    return subComment + leftComment + midComment;
                }
            case Blocks.LIST_IS_EMPTY:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + '列表 ' + leftComment + ' 是否为空';
                }
                else {
                    return subComment + leftComment + midComment;
                }
            case Blocks.LIST_INDEX_OF:
                rightComment = this.getComment(code.list, []);
                leftComment = this.getComment(code.value, []);
                midComment = code.comment;
                if (midComment !== '') {
                    return subComment + leftComment + midComment + rightComment;
                }
                switch (code.type) {
                    case 'FIRST':
                        return subComment + leftComment + ' 第一次在列表 ' + rightComment + ' 中出现的位置';
                    case 'LAST':
                        return subComment + leftComment + ' 最后一次在列表 ' + rightComment + ' 中出现的位置';
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.LIST_GET_INDEX:
                leftComment = this.getComment(code.list, []);
                rightComment = this.getComment(code.index, []);
                midComment = code.comment;
                if (midComment !== '') {
                    if (code.mode === 'REMOVE') {
                        commentList.push({
                            id: code.comment_id,
                            comment: subComment + leftComment + midComment + rightComment,
                        });
                        break;
                    }
                    else {
                        return subComment + leftComment + midComment + rightComment;
                    }
                }
                switch (code.mode) {
                    case 'GET':
                        subComment += '获取列表 ';
                        break;
                    case 'GET_REMOVE':
                        subComment += '获取并移除列表 ';
                        break;
                    case 'REMOVE':
                        subComment += '移除列表 ';
                        break;
                    default:
                        return Blocks.ERROR;
                }
                subComment += leftComment;
                subComment += ' 中';
                switch (code.type) {
                    case 'FIRST':
                        subComment += '第一个元素';
                        break;
                    case 'LAST':
                        subComment += '最后一个元素';
                        break;
                    case 'FROM_START':
                        subComment += ('第' + rightComment + '个元素');
                        break;
                    case 'FROM_END':
                        subComment += ('倒数第' + rightComment + '个元素');
                        break;
                    case 'RANDOM':
                        subComment += '随机一个元素';
                        break;
                    default:
                        return Blocks.ERROR;
                }
                if (code.mode === 'REMOVE') {
                    commentList.push({
                        id: code.comment_id,
                        comment: subComment,
                    });
                    break;
                }
                else {
                    return subComment;
                }
            case Blocks.LIST_SET_INDEX:
                leftComment = this.getComment(code.list, []);
                rightComment = this.getComment(code.index, []);
                midComment = code.comment;
                otherComment = this.getComment(code.value, []);
                if (midComment !== '') {
                    commentList.push({
                        id: code.comment_id,
                        comment: subComment + leftComment + midComment + rightComment + otherComment,
                    });
                    break;
                }
                switch (code.mode) {
                    case 'SET':
                        subComment += ('将元素 ' + otherComment + '设置为列表 ' + leftComment + '的');
                        break;
                    case 'INSERT':
                        subComment += ('将元素 ' + otherComment + '插入列表 ' + leftComment + '的');
                        break;
                    default:
                        return Blocks.ERROR;
                }
                switch (code.type) {
                    case 'FIRST':
                        subComment += '第一个元素';
                        break;
                    case 'LAST':
                        subComment += '最后一个元素';
                        break;
                    case 'FROM_START':
                        subComment += ('第 ' + rightComment + ' 个元素');
                        break;
                    case 'FROM_END':
                        subComment += ('倒数第 ' + rightComment + ' 个元素');
                        break;
                    case 'RANDOM':
                        subComment += '随机一个元素';
                        break;
                    default:
                        return Blocks.ERROR;
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_CREATE_FROM:
                otherComment = this.getComment(code.value, []);
                midComment = code.comment;
                if (midComment !== '') {
                    return subComment + midComment + otherComment;
                }
                switch (code.type) {
                    case 'RANDOM':
                        return subComment + '随机创建链表';
                    case 'RANDOM_WITH_NODE_NUMBER':
                        return subComment + '随机创建 ' + otherComment + ' 个结点的链表';
                    case 'FROM_LIST':
                        return subComment + '创建链表从列表 ' + otherComment;
                    default:
                        return Blocks.ERROR;
                }
            case Blocks.BASELIST_SET_POSITION:
                leftComment = this.getComment(code.x, []) || '0';
                rightComment = this.getComment(code.y, []) || '0';
                otherComment = this.getComment(code.list, []);
                midComment = code.comment;
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_SET:
                leftComment = String(code.var_name);
                rightComment = this.getComment(code.value, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 设置为 ' + rightComment);
                }
                else {
                    subComment += (leftComment + midComment + rightComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_GET:
                midComment = code.comment;
                rightComment = String(code.var_name);
                return subComment + (midComment === '' ? '链表变量 ' : midComment) + rightComment;
            case Blocks.BASENODE_GET_VALUE:
                midComment = code.comment;
                leftComment = this.getComment(code.node, []);
                if (midComment === '') {
                    return subComment + leftComment + midComment;
                }
                else {
                    return subComment + '结点 ' + leftComment + ' 的值';
                }
            case Blocks.BASELIST_GET_NODE_NUMBER:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + leftComment + midComment;
                }
                else {
                    return subComment + '链表 ' + leftComment + ' 的结点数';
                }
            case Blocks.BASELIST_GET_NOWNODE_VALUE:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + leftComment + midComment;
                }
                else {
                    return subComment + '链表 ' + leftComment + ' 当前结点的值';
                }
            case Blocks.BASELIST_NOWNODE_IS_LAST:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + leftComment + midComment;
                }
                else {
                    return subComment + '链表 ' + leftComment + ' 当前结点是否是最后一个结点';
                }
            case Blocks.BASELIST_GET_NEXT_NODE:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + leftComment + midComment;
                }
                else {
                    return subComment + '链表 ' + leftComment + ' 的下一个结点';
                }
            case Blocks.BASENODE_GET:
                midComment = code.comment;
                rightComment = String(code.var_name);
                return subComment + (midComment === '' ? '链表结点变量 ' : midComment) + rightComment;
            case Blocks.BASENODE_SET:
                leftComment = String(code.var_name);
                rightComment = this.getComment(code.node, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表结点 ' + leftComment + ' 设置为 ' + rightComment);
                }
                else {
                    subComment += (leftComment + midComment + rightComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_GET_NOW_NODE:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + '获得链表 ' + leftComment + ' 的当前结点';
                }
                else {
                    return subComment + leftComment + midComment;
                }
            case Blocks.BASELIST_REMOVE_NODE_ONVIEW:
                leftComment = this.getComment(code.list, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 的下一个结点移除');
                }
                else {
                    subComment += (leftComment + midComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_REMOVE_NODE_REAL:
                leftComment = this.getComment(code.list, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 被移除的结点删除');
                }
                else {
                    subComment += (leftComment + midComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_MOVE_TO_NEXT:
                leftComment = this.getComment(code.list, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 的当前结点移动到下一个结点');
                }
                else {
                    subComment += (leftComment + midComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_NOW_POINT_TO_OTHER:
                leftComment = this.getComment(code.list, []);
                rightComment = this.getComment(code.node, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 的当前结点的下一个指向 ' + rightComment);
                }
                else {
                    subComment += (leftComment + midComment + rightComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_NEW_POINT_TO_OTHER:
                leftComment = this.getComment(code.list, []);
                rightComment = this.getComment(code.node, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 的新结点的下一个指向 ' + rightComment);
                }
                else {
                    subComment += (leftComment + midComment + rightComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_ADD_NEW_NODE_TRUE:
                leftComment = this.getComment(code.list, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('将链表 ' + leftComment + ' 的新结点加入链表');
                }
                else {
                    subComment += (leftComment + midComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            case Blocks.BASELIST_GET_NEW_NODE:
                midComment = code.comment;
                leftComment = this.getComment(code.list, []);
                if (midComment === '') {
                    return subComment + '获得链表 ' + leftComment + ' 的新结点';
                }
                else {
                    return subComment + leftComment + midComment;
                }
            case Blocks.BASELIST_CREATE_NEW_NODE:
                leftComment = this.getComment(code.list, []);
                rightComment = this.getComment(code.node, []);
                midComment = code.comment;
                if (midComment === '') {
                    subComment += ('给链表 ' + leftComment + ' 生成新结点 ' + rightComment);
                }
                else {
                    subComment += (leftComment + midComment + rightComment);
                }
                commentList.push({
                    id: code.comment_id,
                    comment: subComment,
                });
                break;
            default:
                return Blocks.ERROR;
        }
        if (code.child !== undefined) {
            this.getComment(code.child, commentList, indend);
        }
        return;
    }
}
