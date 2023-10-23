import { Injectable, Logger } from "@nestjs/common";

import { AbstractRepository } from "@app/common/database/abstract.repository";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Category } from "./schemas/category.schema";


@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
    protected readonly logger = new Logger(CategoriesRepository.name);

    constructor(
        @InjectModel(Category.name) categoryModel: Model<Category>,
        @InjectConnection() connection: Connection,
    ) {
        super(categoryModel, connection);
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