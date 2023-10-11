import { AbstractRepository } from "@app/common";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { WishList } from "./schemas/wishlists.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, connection } from "mongoose";

@Injectable()
export class WishListRepository extends AbstractRepository<WishList> {
protected readonly logger = new Logger(WishListRepository.name);

constructor(
    @InjectModel(WishList.name) wishListModel: Model<WishList>,
    @InjectConnection() connection: Connection
) {
    super(wishListModel, connection)
}
}