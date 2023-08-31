import {Injectable, Logger} from "@nestjs/common"
import { Address, AddressDocument } from "./schema/address.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { AbstractRepository } from "@app/common";

@Injectable()
export class AddressRepository extends AbstractRepository<Address> {
    protected readonly logger = new Logger(AddressRepository.name)

    constructor(
        @InjectModel(Address.name) addressModel: Model<Address>,
        @InjectConnection() connection : Connection
    ){
        super(addressModel, connection)
    }
}