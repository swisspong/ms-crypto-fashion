import { Type } from "@nestjs/common";
import { IProduct } from "./order-event.interface";
import { Types } from "mongoose";


export interface ICartItem {
    item_id: string;
    quantity: number
    vrnt_id?: string
    prod_id: string
    product: IProduct
}

export interface IDeleteChktEventPayload {
    chkt_id: string
    user_id: string
}
export interface IDeleteProductId {
    prod_id: string
}

export interface IDeleteMerchantId {
    _id: Types.ObjectId
}