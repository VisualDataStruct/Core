/**
 * 方块类型
 *
 * @enum {number}
 */
var Blocks;
(function (Blocks) {
    // LOGIC
    Blocks[Blocks["IF"] = 1] = "IF";
    Blocks[Blocks["COMPARE"] = 2] = "COMPARE";
    Blocks[Blocks["LOGIC_OPERATION"] = 3] = "LOGIC_OPERATION";
    Blocks[Blocks["BOOLEAN"] = 4] = "BOOLEAN";
    Blocks[Blocks["LOGIC_NULL"] = 5] = "LOGIC_NULL";
    // LOOP
    Blocks[Blocks["LOOP_REPEAT"] = 6] = "LOOP_REPEAT";
    Blocks[Blocks["LOOP_WHILE"] = 7] = "LOOP_WHILE";
    Blocks[Blocks["LOOP_UNTIL"] = 8] = "LOOP_UNTIL";
    Blocks[Blocks["LOOP_FOR"] = 9] = "LOOP_FOR";
    Blocks[Blocks["LOOP_FLOW_CONTROLS"] = 10] = "LOOP_FLOW_CONTROLS";
    // MATH
    Blocks[Blocks["NUMBER"] = 11] = "NUMBER";
    Blocks[Blocks["MATH_OPERATOR"] = 12] = "MATH_OPERATOR";
    Blocks[Blocks["MATH_FUNCTION"] = 13] = "MATH_FUNCTION";
    Blocks[Blocks["MATH_CONSTANT"] = 14] = "MATH_CONSTANT";
    Blocks[Blocks["MATH_NUMBER_CHECK"] = 15] = "MATH_NUMBER_CHECK";
    Blocks[Blocks["MATH_RANDOM"] = 16] = "MATH_RANDOM";
    // TEXT
    Blocks[Blocks["TEXT"] = 17] = "TEXT";
    Blocks[Blocks["TEXT_JOIN"] = 18] = "TEXT_JOIN";
    Blocks[Blocks["TEXT_LENGTH"] = 19] = "TEXT_LENGTH";
    Blocks[Blocks["TEXT_ISEMPTY"] = 20] = "TEXT_ISEMPTY";
    Blocks[Blocks["TEXT_INDEX_OF"] = 21] = "TEXT_INDEX_OF";
    Blocks[Blocks["TEXT_CHAR_AT"] = 22] = "TEXT_CHAR_AT";
    Blocks[Blocks["TEXT_GET_SUBSTRING"] = 23] = "TEXT_GET_SUBSTRING";
    Blocks[Blocks["TEXT_CHANGE_CASE"] = 24] = "TEXT_CHANGE_CASE";
    // VARIABLES
    Blocks[Blocks["VAR_GET"] = 25] = "VAR_GET";
    Blocks[Blocks["VAR_SET"] = 26] = "VAR_SET";
    Blocks[Blocks["VAR_ADD"] = 27] = "VAR_ADD";
    // LIST
    Blocks[Blocks["LIST_CREATE_EMPTY"] = 28] = "LIST_CREATE_EMPTY";
    Blocks[Blocks["LIST_CREATE_WITH"] = 29] = "LIST_CREATE_WITH";
    Blocks[Blocks["LIST_CREATE_REPEAT"] = 30] = "LIST_CREATE_REPEAT";
    Blocks[Blocks["LIST_LENGTH"] = 31] = "LIST_LENGTH";
    Blocks[Blocks["LIST_IS_EMPTY"] = 32] = "LIST_IS_EMPTY";
    Blocks[Blocks["LIST_INDEX_OF"] = 33] = "LIST_INDEX_OF";
    Blocks[Blocks["LIST_GET_INDEX"] = 34] = "LIST_GET_INDEX";
    Blocks[Blocks["LIST_SET_INDEX"] = 35] = "LIST_SET_INDEX";
    // BASELIST
    Blocks[Blocks["BASELIST_SET_POSITION"] = 36] = "BASELIST_SET_POSITION";
    Blocks[Blocks["BASELIST_GET"] = 37] = "BASELIST_GET";
    Blocks[Blocks["BASELIST_SET"] = 38] = "BASELIST_SET";
    Blocks[Blocks["BASELIST_CREATE_FROM"] = 39] = "BASELIST_CREATE_FROM";
    Blocks[Blocks["BASELIST_GET_NOW_NODE"] = 40] = "BASELIST_GET_NOW_NODE";
    Blocks[Blocks["BASELIST_REMOVE_NODE_ONVIEW"] = 41] = "BASELIST_REMOVE_NODE_ONVIEW";
    Blocks[Blocks["BASELIST_REMOVE_NODE_REAL"] = 42] = "BASELIST_REMOVE_NODE_REAL";
    Blocks[Blocks["BASELIST_MOVE_TO_NEXT"] = 43] = "BASELIST_MOVE_TO_NEXT";
    Blocks[Blocks["BASELIST_NOW_POINT_TO_OTHER"] = 44] = "BASELIST_NOW_POINT_TO_OTHER";
    Blocks[Blocks["BASELIST_NEW_POINT_TO_OTHER"] = 45] = "BASELIST_NEW_POINT_TO_OTHER";
    Blocks[Blocks["BASELIST_ADD_NEW_NODE_TRUE"] = 46] = "BASELIST_ADD_NEW_NODE_TRUE";
    Blocks[Blocks["BASELIST_GET_NEW_NODE"] = 47] = "BASELIST_GET_NEW_NODE";
    Blocks[Blocks["BASELIST_CREATE_NEW_NODE"] = 48] = "BASELIST_CREATE_NEW_NODE";
    Blocks[Blocks["BASELIST_GET_NODE_NUMBER"] = 49] = "BASELIST_GET_NODE_NUMBER";
    Blocks[Blocks["BASELIST_GET_NOWNODE_VALUE"] = 50] = "BASELIST_GET_NOWNODE_VALUE";
    Blocks[Blocks["BASELIST_NOWNODE_IS_LAST"] = 51] = "BASELIST_NOWNODE_IS_LAST";
    Blocks[Blocks["BASELIST_GET_NEXT_NODE"] = 52] = "BASELIST_GET_NEXT_NODE";
    // BASENODE
    Blocks[Blocks["BASENODE_GET"] = 53] = "BASENODE_GET";
    Blocks[Blocks["BASENODE_SET"] = 54] = "BASENODE_SET";
    Blocks[Blocks["BASENODE_GET_VALUE"] = 55] = "BASENODE_GET_VALUE";
    // FLAG
    Blocks[Blocks["ERROR"] = -1] = "ERROR";
    Blocks[Blocks["CONTINUE"] = -2] = "CONTINUE";
    Blocks[Blocks["BREAK"] = -3] = "BREAK";
})(Blocks || (Blocks = {}));
/**
 * 方块类型
 *
 * @enum {number}
 */
var OperBlocks;
(function (OperBlocks) {
    // LOGIC
    OperBlocks[OperBlocks["IF"] = 1] = "IF";
    // LOOP
    OperBlocks[OperBlocks["LOOP_REPEAT"] = 2] = "LOOP_REPEAT";
    OperBlocks[OperBlocks["LOOP_WHILE"] = 3] = "LOOP_WHILE";
    OperBlocks[OperBlocks["LOOP_UNTIL"] = 4] = "LOOP_UNTIL";
    OperBlocks[OperBlocks["LOOP_FOR"] = 5] = "LOOP_FOR";
    OperBlocks[OperBlocks["LOOP_FLOW_CONTROLS"] = 6] = "LOOP_FLOW_CONTROLS";
    // VARIABLES
    OperBlocks[OperBlocks["VAR_SET"] = 7] = "VAR_SET";
    OperBlocks[OperBlocks["VAR_ADD"] = 8] = "VAR_ADD";
    // LIST
    OperBlocks[OperBlocks["LIST_GET_INDEX"] = 9] = "LIST_GET_INDEX";
    OperBlocks[OperBlocks["LIST_SET_INDEX"] = 10] = "LIST_SET_INDEX";
    // BASELIST
    OperBlocks[OperBlocks["BASELIST_SET_POSITION"] = 11] = "BASELIST_SET_POSITION";
    OperBlocks[OperBlocks["BASELIST_SET"] = 12] = "BASELIST_SET";
    OperBlocks[OperBlocks["BASELIST_CREATE_FROM"] = 13] = "BASELIST_CREATE_FROM";
    OperBlocks[OperBlocks["BASELIST_REMOVE_NODE_ONVIEW"] = 14] = "BASELIST_REMOVE_NODE_ONVIEW";
    OperBlocks[OperBlocks["BASELIST_REMOVE_NODE_REAL"] = 15] = "BASELIST_REMOVE_NODE_REAL";
    OperBlocks[OperBlocks["BASELIST_MOVE_TO_NEXT"] = 16] = "BASELIST_MOVE_TO_NEXT";
    OperBlocks[OperBlocks["BASELIST_NOW_POINT_TO_OTHER"] = 17] = "BASELIST_NOW_POINT_TO_OTHER";
    OperBlocks[OperBlocks["BASELIST_NEW_POINT_TO_OTHER"] = 18] = "BASELIST_NEW_POINT_TO_OTHER";
    OperBlocks[OperBlocks["BASELIST_ADD_NEW_NODE_TRUE"] = 19] = "BASELIST_ADD_NEW_NODE_TRUE";
    OperBlocks[OperBlocks["BASELIST_CREATE_NEW_NODE"] = 20] = "BASELIST_CREATE_NEW_NODE";
    // BASENODE
    OperBlocks[OperBlocks["BASENODE_SET"] = 21] = "BASENODE_SET";
    // FLAG
    OperBlocks[OperBlocks["ERROR"] = -1] = "ERROR";
    OperBlocks[OperBlocks["FINISH"] = 0] = "FINISH";
    OperBlocks[OperBlocks["CONTINUE"] = -2] = "CONTINUE";
    OperBlocks[OperBlocks["BREAK"] = -3] = "BREAK";
})(OperBlocks || (OperBlocks = {}));
/**
 * 播放状态
 *
 * @enum {number}
 */
var PlayStatus;
(function (PlayStatus) {
    PlayStatus[PlayStatus["Playing"] = 0] = "Playing";
    PlayStatus[PlayStatus["Stop"] = 1] = "Stop";
    PlayStatus[PlayStatus["Pause"] = 2] = "Pause";
    PlayStatus[PlayStatus["End"] = 3] = "End";
    PlayStatus[PlayStatus["Begin"] = 4] = "Begin";
})(PlayStatus || (PlayStatus = {}));
export { Blocks, PlayStatus, OperBlocks, };
