"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store_type = exports.Multer_enum = void 0;
exports.Multer_enum = {
    imgaes: ["image/png", "image/jpeg"],
};
var Store_type;
(function (Store_type) {
    Store_type["memory"] = "memory";
    Store_type["disk"] = "disk";
})(Store_type || (exports.Store_type = Store_type = {}));
