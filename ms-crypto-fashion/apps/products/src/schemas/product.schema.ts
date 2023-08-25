import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../categories/schemas/category.schema';
import { CategoryWeb } from '../categories/schemas/category-web.schema';
import { Merchant } from '../merchants/schemas/merchant.schema';
// import { Category, CategoryWeb } from 'src/categories/schemas/category.schema';
// import { Merchant } from 'src/merchants/schemas/merchant.schema';
// import { VariantGroup } from 'src/variant_groups/schemas/variant-group.schema';
// import { Variant } from 'src/variants/schemas/variant.schema';

export type ProductDocument = HydratedDocument<Product>;
export enum PaymentMethodFormat {
    CREDIT = "credit",
    WALLET = "wallet",
}
@Schema({ versionKey:false,timestamps: true })
export class Product extends AbstractDocument {
    @Prop({ required: true, unique: true })
    prod_id: string;

    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    description: string;
    @Prop({ type: Boolean, default: false })
    available?: boolean
    @Prop({ type: String })
    sku?: string;

    @Prop({ type: Number, min: 0, isInteger: true, default: 0 })
    stock: number;
    @Prop({ type: Number, min: 0, default: 0 })
    price: number;

    @Prop([String])
    image_urls: string[]


    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    categories: (Types.ObjectId | Category)[];
    @Prop({ type: [{ type: Types.ObjectId, ref: 'CategoryWeb' }] })
    categories_web: (Types.ObjectId | CategoryWeb)[];
    // categories: { cat_id:string; }[];
    @Prop({ type: Types.ObjectId, required: true, ref: "Merchant" })
    merchant: Merchant
    // merchant: Types.ObjectId | Merchant

   
    // @Prop([{ type: VariantGroup }])
    // groups: VariantGroup[]
    // @Prop([{ type: Variant }])
    // variants: Variant[]


    @Prop([String])
    payment_methods: string[]
}



export const ProductSchema = SchemaFactory.createForClass(Product)
    .index({ merchant: 1, name: 1 }, { unique: true })