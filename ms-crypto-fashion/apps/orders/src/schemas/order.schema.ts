import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum StatusFormat {

    NOT_FULLFILLMENT = "not fullfillment",
    FULLFILLMENT = "fullfillment",
    CANCEL = "cancel"
}
export enum PaymentFormat {
    PAID = "paid",
    PENDING = "pending",
    REFUND = "refund"
}

export enum ReviewFormat {
    NOTREVIEWED = 'not reviewed',
    REVIEWED = 'reviewed'
}
export class OrderItem {
    item_id: string
    name: string
    quantity: number
    vrnt_id?: string
    image: string;

    variant: {
        optn_id: string
        vgrp_id: string;
        option_name: string
        group_name: string
    }[]
    price: number
    total: number
    prod_id: string;
}

@Schema({ timestamps: true })
export class Order extends AbstractDocument {
    @Prop({ required: true, unique: true })
    order_id: string;
    @Prop({ required: true })
    user_id: string;
    @Prop({ required: true })
    mcht_id: string;
    @Prop({ required: true })
    mcht_name: string
    @Prop()
    shipping_carier?: string
    @Prop()
    tracking?: string

    @Prop()
    google_id?: string;

    @Prop({ enum: StatusFormat, default: StatusFormat.NOT_FULLFILLMENT })
    status?: string
    @Prop({ enum: PaymentFormat, default: PaymentFormat.PAID })
    payment_status?: string

    @Prop({ enum: ReviewFormat, default: ReviewFormat.NOTREVIEWED })
    reviewStatus?: string
    @Prop({ type: Number, min: 0, default: 0, isInteger: true })
    total_quantity: number;

    @Prop({ type: Number, min: 0, default: 0 })
    total: number;

    @Prop([{ type: OrderItem }])
    items: OrderItem[]

    @Prop({ type: Date })
    shipped_at?: Date;


    @Prop({ type: String, required: true })
    address: string
    @Prop({ type: String, required: true })
    recipient: string

    @Prop({ type: String, required: true })
    post_code: string

    @Prop({ type: String, required: true })
    tel_number: string

    @Prop({})
    chrg_id: string
    // @Prop({ enum: StatusFormat, default: StatusFormat.CHECKOUT })
    // status?: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);