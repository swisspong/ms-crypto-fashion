import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { TransactionPurchase } from "./schemas/transaction.schema";


@Injectable()
export class TransactionPurchaseRepository extends AbstractRepository<TransactionPurchase>{
    protected readonly logger = new Logger(TransactionPurchaseRepository.name);
    constructor(
        @InjectModel(TransactionPurchase.name) model: Model<TransactionPurchase>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection)
    }
}