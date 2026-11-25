"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_js_1 = require("../../common/enum/user.enum.js");
const hash_js_1 = require("../../common/security/hash.js");
const UserSchema = new mongoose_1.default.Schema({
    fName: { type: String, min: 3, max: 20, trim: true, required: true },
    lName: { type: String, min: 3, max: 20, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    age: { type: Number, min: 18, max: 60 },
    phone: String,
    profileImage: String,
    isConfirmed: Boolean,
    isDeleted: Boolean,
    role: {
        type: String,
        enum: [user_enum_js_1.RoleEnum.user, user_enum_js_1.RoleEnum.admin],
        default: user_enum_js_1.RoleEnum.user,
    },
    gender: {
        type: String,
        enum: [user_enum_js_1.GenderEnum.male, user_enum_js_1.GenderEnum.female],
        default: user_enum_js_1.GenderEnum.male,
    },
    followUser: Array,
    acceptfollower: Array,
}, {
    timestamps: true,
    strictQuery: true,
});
UserSchema.pre("save", async function () {
    this.is_new = this.isNew;
    if (this.modifiedPaths()) {
        this.password = await (0, hash_js_1.Hash)(this.password);
    }
});
// UserSchema.post("save", async function () {
//     const that = this as HydratedDocument<IUser & { is_new: boolean }>;
//     const otp = generate_otp();
//     const otpHash = await Hash(otp);
//     await RedisService.setValue({
//         key: `otp:${this.email}`,
//         value: otpHash,
//         ttl: 5*60, // 5 minutes
//     });
//     await RedisService.setValue({
//         key: `otp:max:${this.email}`,
//         value: 1,
//         ttl: 5*60, // 5 minutes
//     });
//     if (that.is_new) {
//         await sendEmail({
//             to: this.email,
//             subject: "confirm",
//             html: `<h1>${otp}</h1>`,
//         });
//     }
// });
// UserSchema.pre(["findOne", "find"], async function () {
//     console.log("============= pre =============");
//     const query = this.getQuery();
//     const { paranoid, ...rest } = query;
//     if (paranoid == true) {
//         this.setQuery({ ...rest });
//     } else {
//         this.setQuery({ ...rest, isDeleted: { $exists: false } });
//     }
// });
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
exports.default = userModel;
