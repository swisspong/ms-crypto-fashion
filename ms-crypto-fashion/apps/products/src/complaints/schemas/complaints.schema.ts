import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type ComplaintDocument = HydratedDocument<Complaint>

export enum TypeFormat {
    PRODUCT= "product",
    MERCHANT= "merchant"
}

export enum StatusFormat {
    PENDING= "pending",
    PROGRESS= "progress",
    RESOLVED= "resolved",
    CLOSING= "closing"
}


@Schema({ versionKey:false,timestamps: true })
export class Complaint extends AbstractDocument{
    @Prop({ type: String, required: true, unique: true })
    comp_id: string;

    @Prop({ type: String})
    user_id: string;

    @Prop({ type: String})
    mcht_id?: string

    @Prop({ type: String })
    prod_id?: string 

    @Prop({ type: String, required: true })
    detail?: string;

    @Prop({  enum: TypeFormat })
    type?: string;

    @Prop({  enum: StatusFormat, default: StatusFormat.PENDING })
    status?: string
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint)