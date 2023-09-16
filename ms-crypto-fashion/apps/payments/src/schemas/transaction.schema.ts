import { AbstractDocument } from "@app/common";
import { PaymentMethodFormat } from "@app/common/enums";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum TransactionFormat {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
    REFUND = "REFUND"
}


@Schema({ timestamps: true })
export class TransactionPurchase extends AbstractDocument {
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
    @Prop({ enum: TransactionFormat })
    type: string
    @Prop({ type: Number, min: 0, default: 0 })
    amount: number;
}

export const TransactionPurchaseSchema = SchemaFactory.createForClass(TransactionPurchase);