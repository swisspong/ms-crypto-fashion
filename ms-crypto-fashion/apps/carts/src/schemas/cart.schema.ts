import { AbstractDocument } from "@app/common";
import { MerchantStatus } from "@app/common/enums";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "apps/products/src/schemas/product.schema";



export enum PaymentMethodFormat {
    CREDIT = "credit",
    WALLET = "wallet",
}
class Merchant  {

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
// export class Product  {
    
//     prod_id: string;


//     name: string;

//     available?: boolean



//     stock: number;

//     price: number;


//     image_urls: string[]



//     merchant: Merchant


//     groups: VariantGroup[]

//     variants: Variant[]

//     payment_methods: string[]
// }


export class CartItem {
    item_id: string;
    quantity: number
    vrnt_id?: string
    prod_id: string
    product: Product
}

@Schema({ timestamps: true })
export class Cart extends AbstractDocument {
    @Prop({ required: true, unique: true })
    cart_id: string;
    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop([{ type: CartItem }])
    items: CartItem[]

}

export const CartSchema = SchemaFactory.createForClass(Cart);