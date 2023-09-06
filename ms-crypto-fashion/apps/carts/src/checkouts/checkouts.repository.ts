


import { Injectable, Logger } from "@nestjs/common";

import { AbstractRepository } from "@app/common/database/abstract.repository";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Checkout } from "./schemas/checkout.schema";
// import { Cart } from "./schemas/cart.schema";


@Injectable()
export class CheckoutsRepository extends AbstractRepository<Checkout> {
    protected readonly logger = new Logger(CheckoutsRepository.name);

    constructor(
        @InjectModel(Checkout.name) checkoutModel: Model<Checkout>,
        @InjectConnection() connection: Connection,
    ) {
        super(checkoutModel, connection);
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