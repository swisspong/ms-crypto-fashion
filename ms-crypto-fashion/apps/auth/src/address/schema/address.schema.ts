import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type AddressDocument = HydratedDocument<Address>;


@Schema({versionKey: false, timestamps: true })
export class Address extends AbstractDocument {
    @Prop({ type: String, required: true, unique: true })
    addr_id: string;

    @Prop({ required: true })
    user_id: string;
    @Prop({ type: String, required: true })
    recipient: string
    @Prop({ type: String, required: true })
    address: string

    @Prop({ type: String, required: true })
    post_code: string

    @Prop({ type: String, required: true })
    tel_number: string
}

export const AddressSchema = SchemaFactory.createForClass(Address)