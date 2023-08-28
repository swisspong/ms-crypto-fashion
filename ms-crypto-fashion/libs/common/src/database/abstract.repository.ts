import { Logger, NotFoundException } from '@nestjs/common';
import {
    FilterQuery,
    Model,
    Types,
    UpdateQuery,
    SaveOptions,
    Connection,
    PipelineStage,
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
    async aggregate(pipeline?: PipelineStage[]) {
        return this.model.aggregate(pipeline)
    }
    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });

        if (!document) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }

    async findOneAndDelete(
        filterQuery: FilterQuery<TDocument>
    ) {
        const document = await this.model.findOneAndDelete(filterQuery, { lean: true });

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
        return this.model.find(filterQuery, {}, { lean: true });
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