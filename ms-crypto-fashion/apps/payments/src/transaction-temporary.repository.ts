import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { TransactionTemporary } from "./schemas/transaction-temporary.schema";


@Injectable()
export class TransactionTemporaryRepository extends AbstractRepository<TransactionTemporary>{
    protected readonly logger = new Logger(TransactionTemporaryRepository.name);
    constructor(
        @InjectModel(TransactionTemporary.name) model: Model<TransactionTemporary>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection)
    }
}