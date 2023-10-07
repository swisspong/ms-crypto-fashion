import { Logger, NotFoundException } from '@nestjs/common';
import {
    FilterQuery,
    Model,
    Types,
    UpdateQuery,
    SaveOptions,
    Connection,
    PipelineStage,
    PopulateOptions,
    UpdateWithAggregationPipeline,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(
        protected readonly model: Model<TDocument>,
        private readonly connection: Connection,
    ) { }

    async create(
        document: Omit<TDocument, '_id'>,
        options?: SaveOptions,
    ): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (
            await createdDocument.save(options)
        ).toJSON() as unknown as TDocument;
    }

    async createMany(
        documents: Array<Omit<TDocument, '_id'>>,
        options?: SaveOptions
    ): Promise<Array<TDocument>> {
        const createdDocuments: Array<TDocument> = [];

        for (const document of documents) {
            const createdDocument = new this.model({
                ...document,
                _id: new Types.ObjectId(),
            });

            createdDocuments.push(await createdDocument.save(options));
        }

        return createdDocuments;
    }

    async findOne(filterQuery: FilterQuery<TDocument>) {
        const document = await this.model.findOne(filterQuery, {}, { lean: true });

        // if (!document) {
        //     this.logger.warn('Document not found with filterQuery', filterQuery);
        //     throw new NotFoundException('Document not found.');
        // }

        return document;
    }

    async findOnePopulate(filterQuery: FilterQuery<TDocument>, populate: (string | PopulateOptions)[]): Promise<any> {
        let query = await this.model.findOne(filterQuery).populate(populate)
        // query.populate(populate.path)
        return query
    }

    async aggregate(pipeline?: PipelineStage[]) {
        return this.model.aggregate(pipeline)
    }
    async findAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateWithAggregationPipeline | UpdateQuery<TDocument>) {
        const document = await this.model.updateMany(filterQuery, update, { lean: true, new: true })
        if (!document) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }
    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });

        // if (!document) {
        //     this.logger.warn(`Document not found with filterQuery:`, filterQuery);
        //     throw new NotFoundException('Document not found.');
        // }

        return document;
    }

    async findOneAndDelete(
        filterQuery: FilterQuery<TDocument>
    ) {
        const document = await this.model.findOneAndDelete(filterQuery, { lean: true });

        // if (!document) {
        //     this.logger.warn(`Document not found with filterQuery:`, filterQuery);
        //     throw new NotFoundException('Document not found.');
        // }

        return document;
    }
    async deleteMany(filterQuery: FilterQuery<TDocument>) {
        const document = await this.model.deleteMany(filterQuery, { lean: true })
        if (!document) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new NotFoundException('Document not found.');
        }
        return document;
    }

    async upsert(
        filterQuery: FilterQuery<TDocument>,
        document: Partial<TDocument>,
    ) {
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        });
    }

    async find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, { lean: true })
    }
    async findPopulate(filterQuery: FilterQuery<TDocument>, populate: (string | PopulateOptions)[]) {
        return this.model.find(filterQuery, {}, { lean: true }).populate(populate)
    }
    async findCount(filterQuery: FilterQuery<TDocument>): Promise<number> {
        return this.model.find(filterQuery).countDocuments({})
    }
    async startTransaction() {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }
}