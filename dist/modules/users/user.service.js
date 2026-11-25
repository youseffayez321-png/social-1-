"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_js_1 = require("../../DB/repositories/user.repository.js");
const mongoose_1 = require("mongoose");
const globalError_js_1 = require("../../common/utils/globalError.js");
class UserService {
    _UserRepo = new user_repository_js_1.UserRepository();
    constructor() { }
    //========================================== 1 get Profile =======================================
    getProfile = async (req, res, next) => {
        res.status(200).json({ message: `done`, data: req.user });
    };
    //========================================== 2 update Profile =======================================
    updateProfile = async (req, res, next) => {
        const { fName, lName, gender, age, phone } = req.body;
        const updateQuery = {};
        if (fName != undefined) {
            updateQuery.fName = fName;
        }
        if (lName != undefined) {
            updateQuery.lName = lName;
        }
        if (gender != undefined) {
            updateQuery.gender = gender;
        }
        if (age != undefined) {
            updateQuery.age = age;
        }
        if (phone != undefined) {
            updateQuery.phone = phone;
        }
        const user = await this._UserRepo.findByIdAndUpdate({
            id: req.user._id,
            update: updateQuery,
            options: { new: true, runValidators: true },
        });
        res.status(200).json({ message: "user updated", data: req.user });
    };
    //========================================== 3 follow user =======================================
    followUser = async (req, res, next) => {
        const { id } = req.body;
        const user = await this._UserRepo.findById({ id, options: {} });
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new globalError_js_1.AppError("invalid id", 400);
        }
        for (const user of req.user.followUser) {
            if (user.toString() === id) {
                throw new globalError_js_1.AppError("you already follow this user", 400);
            }
        }
        if (!user) {
            throw new globalError_js_1.AppError("user not found", 404);
        }
        if (user._id == req.user._id) {
            throw new globalError_js_1.AppError("you cant follow yourself", 400);
        }
        await this._UserRepo.findByIdAndUpdate({
            id: req.user._id,
            update: { $addToSet: { followUser: id } },
            options: { new: true, runValidators: true },
        });
        await this._UserRepo.findByIdAndUpdate({
            id,
            update: { $addToSet: { acceptfollower: req.user._id } },
            options: { new: true, runValidators: true },
        });
        res.status(200).json({ message: "user followed" });
    };
    //========================================== 4 unfollow user =======================================
    unfollowUser = async (req, res, next) => {
        const { id } = req.body;
        const user = await this._UserRepo.findById({ id, options: {} });
        const isFollowing = [...req.user.followUser].find((userId) => userId.toString() === id);
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new globalError_js_1.AppError("invalid id", 400);
        }
        if (!isFollowing) {
            throw new globalError_js_1.AppError("you dont follow this user", 400);
        }
        if (!user) {
            throw new globalError_js_1.AppError("user not found", 404);
        }
        await this._UserRepo.findByIdAndUpdate({
            id,
            update: { $pull: { acceptfollower: req.user._id } },
            options: { new: true, runValidators: true },
        });
        await this._UserRepo.findByIdAndUpdate({
            id: req.user._id,
            update: { $pull: { followUser: id } },
            options: { new: true, runValidators: true },
        });
        res.status(200).json({ message: "user unfollowed" });
    };
    //========================================== 5 search user =======================================
    searchUser = async (req, res, next) => {
        const { id } = req.body;
        const user = await this._UserRepo.findById({ id, options: {} });
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new globalError_js_1.AppError("invalid id", 400);
        }
        if (req.user._id.toString() === id) {
            throw new globalError_js_1.AppError("you cant search yourself", 400);
        }
        if (!user) {
            throw new globalError_js_1.AppError("user not found", 404);
        }
        res.status(200).json({ message: "user found", user });
    };
}
exports.default = new UserService();
