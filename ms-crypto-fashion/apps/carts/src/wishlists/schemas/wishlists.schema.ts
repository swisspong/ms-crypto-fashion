import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "apps/products/src/schemas/product.schema";

export class WishListItem {
    item_id: string;
    prod_id: string;
    product: Product
}

@Schema({timestamps: true})
export class WishList extends AbstractDocument {
    @Prop({required: true, unique: true})
    wishl_id: string;
    @Prop({ required: true })
    user_id: string;
    @Prop([{ type: WishListItem }])
    items: WishListItem[]
}

export const WishListSchema = SchemaFactory.createForClass(WishList);