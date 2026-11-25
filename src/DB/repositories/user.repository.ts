import { Model, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
import { DBRepository } from "./db.repository.js";
import userModel, { IUser } from "../models/user.model.js";

export class UserRepository extends DBRepository<IUser> {
    constructor(public model: Model<IUser> =userModel) {
        super(model)
    }
    createUser = async ( data : Partial<IUser> ) => {
        return await this.model.create([data]);
    };
}
