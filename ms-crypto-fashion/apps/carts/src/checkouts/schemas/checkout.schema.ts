import { AbstractDocument } from "@app/common";
import { MerchantStatus } from "@app/common/enums";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



export enum PaymentMethodFormat {
    CREDIT = "credit",
    WALLET = "wallet",
}
class Merchant {

    mcht_id: string;

    user_id: string;

    name: string;

    status?: string

}
class Option {
    optn_id: string
    name: string
}

class VariantGroup {
    vgrp_id: string;
    name: string
    options: Option[]
}
class VariantSelected {
    optn_id: string;
    vgrp_id: string;
}




class Variant {
    vrnt_id: string;
    variant_selecteds: VariantSelected[]
    price: number
    stock: number;
    image_url?: string
}
export class Product {

    prod_id: string;


    name: string;

    available?: boolean



    stock: number;

    price: number;


    image_urls: string[]



    merchant: Merchant


    groups: VariantGroup[]

    variants: Variant[]

    payment_methods: string[]
}


export class CheckoutItem {
    item_id: string;
    quantity: number
    price: number;
    total: number
    variant: {
        optn_id: string
        vgrp_id: string;
        option_name: string
        group_name: string
    }[]
    image: string;
    vrnt_id?: string
    prod_id: string
    product: Product
}

@Schema({ timestamps: true })
export class Checkout extends AbstractDocument {
    @Prop({ required: true, unique: true })
    chkt_id: string
    @Prop({ required: true })
    user_id: string;
    
    @Prop({ enum: PaymentMethodFormat })
    payment_method: string

    @Prop([{ type: CheckoutItem }])
    items: CheckoutItem[]

}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);