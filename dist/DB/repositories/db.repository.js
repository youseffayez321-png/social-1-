"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepository = void 0;
class DBRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create = async ({ data }) => {
        return await this.model.create([data]);
    };
    findOne = async ({ filter, options = {}, }) => {
        return await this.model.findOne(filter, options);
    };
    findById = async ({ id, options = {}, }) => {
        return await this.model.findById(id, options);
    };
    findByIdAndUpdate = async ({ id, update, options = {}, }) => {
        return await this.model.findByIdAndUpdate(id, update, {
            new: true,
            runValidatiors: true,
            ...options,
        });
    };
    findOneAndUpdate = async ({ filter, update, options = {}, }) => {
        return await this.model.findOneAndUpdate(filter, update, {
            new: true,
            runValidatiors: true,
            ...options,
        });
    };
    find = async ({ filter, options = {}, }) => {
        const data = this.model.find(filter);
        if (options?.limit)
            data.limit(options?.limit);
        if (options?.skip)
            data.skip(options?.skip);
        if (options?.sort)
            data.sort(options?.sort);
        if (options?.populate)
            data.populate(options?.populate);
        return data.exec();
    };
}
exports.DBRepository = DBRepository;
