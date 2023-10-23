import { AbstractDocument } from '@app/common/database/abstract.schema';
import { RoleFormat } from '@app/common/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';



@Schema({ versionKey: false, timestamps: true })
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
    mcht_id?: string

    @Prop({ type: String})
    cart?: string

    @Prop({type: Boolean, default: false})
    isVerified?: boolean

    @Prop({type: String})
    emailToken?: string

    @Prop({type: String})
    changeToken?: string

    @Prop({type: String})
    changeEmail?: string
    
    @Prop({type: String})
    passToken?: string

}

export const UserSchema = SchemaFactory.createForClass(User);