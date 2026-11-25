import mongoose, { HydratedDocument } from "mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/user.enum.js";
import { Hash } from "../../common/security/hash.js";
import { generate_otp, sendEmail } from "../../common/service/sendEmail.js";
import RedisService from "../../DB/redis.connection.js";
export interface IUser {
    fName: string;
    lName: string;
    email: string;
    password: string;
    age?: number;
    phone?: string;
    profileImage?: string;
    isConfirmed?: boolean;
    isDeleted?: boolean;
    role?: RoleEnum;
    gender?: GenderEnum;
    followUser?: Array<string>;
    acceptfollower?: Array<string>;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
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
            enum: [RoleEnum.user, RoleEnum.admin],
            default: RoleEnum.user,
        },
        gender: {
            type: String,
            enum: [GenderEnum.male, GenderEnum.female],
            default: GenderEnum.male,
        },
        followUser: Array<string>,
        acceptfollower: Array<string>,
    },
    {
        timestamps: true,
        strictQuery: true,
    },
);
UserSchema.pre(
    "save",
    async function (this: HydratedDocument<IUser & { is_new: boolean }>) {
        this.is_new = this.isNew;
        if (this.modifiedPaths()) {
            this.password = await Hash(this.password);
        }
    },
);
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
const userModel =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default userModel;
