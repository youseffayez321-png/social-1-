import { Model, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export abstract class DBRepository<T> {
    constructor(public model: Model<T>) {}
    create = async ({ data }: { data: Partial<T> }) => {
        return await this.model.create([data]);
    };
    findOne = async ({
        filter,
        options = {},
    }: {
        filter: QueryFilter<T>;
        options: QueryOptions<T>;
    }) => {
        return await this.model.findOne(filter, options);
    };
    findById = async ({
        id,
        options = {},
    }: {
        id: any;
        options: QueryOptions<T>;
    }) => {
        return await this.model.findById(id, options);
    };
    findByIdAndUpdate = async ({
        id,
        update,
        options = {},
    }: {
        id: any;
        update: UpdateQuery<T>;
        options: QueryOptions<T>;
    }) => {
        return await this.model.findByIdAndUpdate(id, update, {
            new: true,
            runValidatiors: true,
            ...options,
        });
    };
    findOneAndUpdate = async ({
        filter,
        update,
        options = {},
    }: {
        filter: QueryFilter<T>;
        update: UpdateQuery<T>;
        options: QueryOptions<T>;
    }) => {
        return await this.model.findOneAndUpdate(filter, update, {
            new: true,
            runValidatiors: true,
            ...options,
        });
    };
    find = async ({
        filter,
        options = {},
    }: {
        filter: QueryFilter<T>;
        options: QueryOptions<T>;
    }) => {
        const data = this.model.find(filter);
        if (options?.limit) data.limit(options?.limit);
        if (options?.skip) data.skip(options?.skip);
        if (options?.sort) data.sort(options?.sort);
        if (options?.populate) data.populate(options?.populate as string);
        return data.exec();
    };
}
