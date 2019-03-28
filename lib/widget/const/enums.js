/**
 * 形状枚举
 *
 * @enum {number}
 */
var Shape;
(function (Shape) {
    Shape[Shape["Circle"] = 0] = "Circle";
    Shape[Shape["Text"] = 1] = "Text";
    Shape[Shape["Line"] = 2] = "Line";
})(Shape || (Shape = {}));
/**
 * 状态枚举
 *
 * @enum {number}
 */
var Status;
(function (Status) {
    Status[Status["Default"] = 0] = "Default";
    Status["Hover"] = "hover";
    Status["Visited"] = "vised";
    Status["Found"] = "found";
    Status["New"] = "new";
})(Status || (Status = {}));
export { Shape, Status, };
