import { Injectable, Logger } from "@nestjs/common";

import { AbstractRepository } from "@app/common/database/abstract.repository";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, FilterQuery, Model } from "mongoose";
import { CategoryWeb } from "./schemas/category-web.schema";



@Injectable()
export class CategoryWebRepository extends AbstractRepository<CategoryWeb> {
    protected readonly logger = new Logger(CategoryWebRepository.name);

    constructor(
        @InjectModel(CategoryWeb.name) categoryWebModel: Model<CategoryWeb>,
        @InjectConnection() connection: Connection,
    ) {
        super(categoryWebModel, connection);
    }
    async find(filterQuery: FilterQuery<CategoryWeb>, populateOptions?: string[], skip?: number, limit?: number, sort?: any, session?: ClientSession): Promise<CategoryWeb[]> {
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

    // async findOnePopulate(filterQuery: FilterQuery<User>): Promise<User> {
    //     // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    //     return this.model.findOne(filterQuery).populate("merchant").exec()
    // }
    // // async findOnePopulateCart(filterQuery: FilterQuery<User>): Promise<User> {
    // //     // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    // //     return this.model.findOne(filterQuery).populate("cart").exec()
    // // }

    // async findSelect(filterQuery: FilterQuery<User>, populateOptions?: string[], skip?: number, limit?: number, select?: string, session?: ClientSession): Promise<User[]> {
    //     let query = this.model.find(filterQuery);
    //     if (populateOptions && populateOptions.length > 0) {
    //         query.populate(populateOptions.join(' '))
    //     }

    //     if (skip !== undefined && limit !== undefined) {
    //         if (select !== undefined)
    //             query = query.select(select).skip(skip).limit(limit)
    //         else
    //             query = query.skip(skip).limit(limit)
    //     }
    //     if (session) {
    //         query = query.session(session)
    //     }


    //     return query.exec()
    // }

    // async findCount(filterQuery: FilterQuery<User>): Promise<number> {
    //     // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    //     return this.model.find(filterQuery).countDocuments({})
    // }
}