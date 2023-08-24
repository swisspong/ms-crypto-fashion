import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum RoleFormat {
    USER = "user",
    MERCHANT = "merchant",
    ADMIN = "admin"
}

@Schema({ versionKey: false })
export class User extends AbstractDocument {
    @Prop({ type: String, required: true, unique: true })
    user_id: string;

    @Prop()
    username?: string;

    @Prop()
    password?: string;

    @Prop()
    email?: string;

    @Prop()
    google_id?: string;
    @Prop()
    address?: string;
    @Prop({ enum: RoleFormat, default: RoleFormat.USER })
    role?: string


    @Prop([String])
    permission?: string[]

    
    @Prop({ type: String })
    merchant?: string

    @Prop({ type: String})
    cart?: string


}

export const UserSchema = SchemaFactory.createForClass(User);