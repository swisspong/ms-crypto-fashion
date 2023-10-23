import { AnyKeys, ClientSession, Document, FilterQuery, Model, PipelineStage, PopulateOptions, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";


export abstract class BaseRepository<T extends Document, K>{
    constructor(protected readonly model: Model<T>) { }

    async findOne(filterQuery: FilterQuery<T>, populateOptions?: string[], session?: ClientSession): Promise<T> {
        let query = this.model.findOne(filterQuery);
        if (populateOptions && populateOptions.length > 0) {
            query.populate(populateOptions.join(' '))
        }
        if (session) {
            query = query.session(session)
        }
        return query.exec()
    }
    async findOnePopulateNew(filterQuery: FilterQuery<T>, populate: (string | PopulateOptions)[]): Promise<any> {
        let query = await this.model.findOne(filterQuery).populate(populate)
        // query.populate(populate.path)
        return query
    }
    async find(filterQuery: FilterQuery<T>, populateOptions?: string[], skip?: number, limit?: number, sort?: any, session?: ClientSession): Promise<T[]> {
        let query = this.model.find(filterQuery);
        if (populateOptions && populateOptions.length > 0) {
            query.populate(populateOptions.join(' '))
        }
        if (skip !== undefined && limit !== undefined) {
            query = query.sort(sort).skip(skip).limit(limit)
        }
        if (session) {
            query = query.session(session)
        }
        return query.exec()
    }
    async findOneAndUpdate(filterQuery: FilterQuery<T>,
        //  data: Partial<T>
        data: UpdateQuery<T>
        , session?: ClientSession): Promise<T> {
        return this.model.findOneAndUpdate(filterQuery, data, { new: true }).session(session).exec();
    }
    async updateOne(filter: FilterQuery<T>, update?: UpdateWithAggregationPipeline | UpdateQuery<T>, session?: ClientSession) {
        return this.model.updateOne(filter, update, { new: true }).session(session).exec()
    }
    async update(filter: FilterQuery<T>, update?: UpdateWithAggregationPipeline | UpdateQuery<T>, session?: ClientSession) {
        return this.model.updateMany(filter, update, { multi: true, new: true }).session(session).exec()
    }
    async findOneAndDelete(filterQuery: FilterQuery<T>, session?: ClientSession): Promise<T> {
        return this.model.findOneAndDelete(filterQuery).session(session).exec();
    }
    
    async create(data: K, session?: ClientSession): Promise<T> {
        const newData = new this.model(data);
        const savedData = await newData.save({ session });
        return savedData as T;
    }

    async createMany(session?: ClientSession, ...docs: (T | AnyKeys<T>)[]) {
        return this.model.create(docs, { session: session })
    }
    async bulkWrite(data: any, session?: ClientSession) {
        return this.model.bulkWrite(data, { session })
    }
    async aggregate(pipeline?: PipelineStage[]) {
        return this.model.aggregate(pipeline)
    }

    async countDoc(filter?: FilterQuery<T>) {
        return this.model.countDocuments(filter)
    }


}