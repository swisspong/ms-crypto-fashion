import { Injectable } from "@nestjs/common"
import { BaseRepository } from "src/shared/base.repository";
import { User, UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, FilterQuery, Model } from "mongoose";
@Injectable()
export class UserRepository extends BaseRepository<UserDocument, User> {
    constructor(
        @InjectModel(User.name) model: Model<UserDocument>
    ) {
        super(model)
    }

    async findOnePopulate(filterQuery: FilterQuery<User>): Promise<User> {
        // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
        return this.model.findOne(filterQuery).populate("merchant").exec()
    }
    // async findOnePopulateCart(filterQuery: FilterQuery<User>): Promise<User> {
    //     // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    //     return this.model.findOne(filterQuery).populate("cart").exec()
    // }

    async findSelect(filterQuery: FilterQuery<User>, populateOptions?: string[], skip?: number, limit?: number, select?: string, session?: ClientSession): Promise<User[]> {
        let query = this.model.find(filterQuery);
        if (populateOptions && populateOptions.length > 0) {
            query.populate(populateOptions.join(' '))
        }

        if (skip !== undefined && limit !== undefined) {
            if (select !== undefined)
                query = query.select(select).skip(skip).limit(limit)
            else 
                query = query.skip(skip).limit(limit)
        }
        if (session) {
            query = query.session(session)
        }


        return query.exec()
    }

    async findCount(filterQuery: FilterQuery<User>): Promise<number> {
        // return this.userModel.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
        return this.model.find(filterQuery).countDocuments({})
    }

}