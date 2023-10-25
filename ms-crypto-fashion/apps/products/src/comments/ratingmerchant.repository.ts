import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { RatingMerchant } from "./schemas/ratingmerchant.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

@Injectable()
export class RatingMerchantRepository extends AbstractRepository<RatingMerchant> {
    protected readonly logger = new Logger(RatingMerchantRepository.name);
    constructor(
        @InjectModel(RatingMerchant.name) commentModel: Model<RatingMerchant>,
        @InjectConnection() connection: Connection
    ) {
        super(commentModel, connection)
    }
}