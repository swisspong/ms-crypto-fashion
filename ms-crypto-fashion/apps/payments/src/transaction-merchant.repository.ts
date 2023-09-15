import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { TransactionMerchant } from "./schemas/transaction-merchant";


@Injectable()
export class TransactionMerchantRepository extends AbstractRepository<TransactionMerchant>{
    protected readonly logger = new Logger(TransactionMerchantRepository.name);
    constructor(
        @InjectModel(TransactionMerchant.name) model: Model<TransactionMerchant>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection)
    }
}