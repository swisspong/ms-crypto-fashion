import { AbstractDocument } from '@app/common/database/abstract.schema';
import { MerchantStatus } from '@app/common/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ versionKey: false })
export class Merchant extends AbstractDocument {
    @Prop({ required: true, unique: true })
    mcht_id: string;
    @Prop({ required: true, unique: true })
    user_id: string;
    @Prop({ type: String, unique: true })
    name: string;
    @Prop({ enum: MerchantStatus, default: MerchantStatus.CLOSED })
    status?: string
    @Prop({ type: String })
    banner_url?: string
    @Prop({ type: String })
    banner_title: string
    @Prop({ type: Number, required: true, default: 0 })
    amount: number

    @Prop({ type: String })
    first_name?: string;
    @Prop({ type: String })
    last_name?: string;
    @Prop({ type: String })
    id_card_img?: string;
    @Prop({ type: Date })
    end_date?: Date


}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);