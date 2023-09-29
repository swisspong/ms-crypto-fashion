import { AbstractDocument } from "@app/common";
import { PaymentMethodFormat } from "@app/common/enums";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({ timestamps: true })
export class TransactionTemporary extends AbstractDocument {
    @Prop({ required: true, unique: true })
    tx_id: string;
    @Prop({ required: true })
    order_id: string;
    @Prop({ required: true })
    user_id: string;
    @Prop({ required: true })
    mcht_id: string;
    @Prop({ enum: PaymentMethodFormat })
    payment_method: string
    @Prop({ type: Number, min: 0, default: 0 })
    amount: number;
}

export const TransactionTemporarySchema = SchemaFactory.createForClass(TransactionTemporary);