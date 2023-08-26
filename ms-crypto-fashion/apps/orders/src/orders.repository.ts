import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Order } from "./schemas/order.schema";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";


@Injectable()
export class OrdersRepository extends AbstractRepository<Order>{
    protected readonly logger = new Logger(OrdersRepository.name);
    constructor(
        @InjectModel(Order.name) model: Model<Order>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection)
    }

    // async findOne(filterQuery: FilterQuery<Order>): Promise<Order> {
    //     return this.model.findOne(filterQuery)
    // }
    // async findOnePopulate(filterQuery: FilterQuery<Order>): Promise<Order> {
    //     // return this.model.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    //     return this.model.findOne(filterQuery).populate("merchant").exec()
    // }
    // // async findOnePopulateProduct(filterQuery: FilterQuery<Order>): Promise<Order> {
    // //     // return this.model.findOne(filterQuery,undefined,{populate:{path:"merchant"}})
    // //     return this.model.findOne(filterQuery).populate("items.product").exec()
    // // }

    // async find(filterQuery: FilterQuery<Order>): Promise<(Order)[]> {
    //     return this.model.find(filterQuery)
    // }
    // async create(data: Order): Promise<Order> {
    //     const newData = new this.model(data)

    //     return newData.save()
    // }

    // async findOneAndUpdate(filterQuery: FilterQuery<Order>, data: Partial<Order>): Promise<Order> {
    //     return this.model.findOneAndUpdate(filterQuery, data, { new: true })
    // }
    // async findOneAndDelete(filterQuery: FilterQuery<Order>): Promise<Order> {
    //     return this.model.findOneAndDelete(filterQuery)
    // }

}