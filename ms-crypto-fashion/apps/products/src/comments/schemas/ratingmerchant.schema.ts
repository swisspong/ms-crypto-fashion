import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type RatingMerchantDocument = HydratedDocument<RatingMerchant>;

@Schema({ versionKey: false, timestamps: true })
export class RatingMerchant extends AbstractDocument {
    @Prop({ type: String, required: true })
    rtmcht_id: string;

    @Prop({ type: String, required: true })
    mcht_id: string

    @Prop({ type: Number, required: true, min: 1, mix: 5 })
    rating: number
}


export const RatingMerchantSchema = SchemaFactory.createForClass(RatingMerchant)