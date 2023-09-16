import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({versionKey: false, timestamps: true})
export class TransactionMerchant extends AbstractDocument {
    @Prop({required: true, unique: true})
    tsmcht_id: string;
    @Prop({type: String, required: true})
    mcht_id: string
    @Prop({type: Number, required: true, min: 0})
    amount: number
}

export const TransactionMerchantSchema = SchemaFactory.createForClass(TransactionMerchant);