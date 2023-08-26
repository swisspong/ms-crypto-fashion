import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export class CartItem {
    item_id: string;
    quantity: number
    vrnt_id?: string
    prod_id:string 
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