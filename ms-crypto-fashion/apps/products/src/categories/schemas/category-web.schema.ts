import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false,timestamps:true })
export class CategoryWeb extends AbstractDocument {
    @Prop({ required: true, unique: true })
    catweb_id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    image_url?: string

    // * user admin
    @Prop({ type: String })
    user_id: string


}

export const CategoryWebSchema = SchemaFactory.createForClass(CategoryWeb);