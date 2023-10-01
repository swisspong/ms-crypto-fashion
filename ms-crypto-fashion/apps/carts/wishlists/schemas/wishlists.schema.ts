import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class WishListItem {
    item_id: string;
    prod_id: string;
    name: string;
    description: string;
    price: number
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