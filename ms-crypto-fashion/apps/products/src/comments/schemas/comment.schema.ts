import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({versionKey: false, timestamps: true})
export class Comment extends AbstractDocument{
    @Prop({ type: String, required: true, unique: true })
    comment_id: string;

    @Prop({ type: String, required: true})
    user_id: string

    @Prop({ type: String, required: true})
    prod_id: string

    @Prop({type: String, trim: true})
    text?: string

    @Prop({type: Number, required: true, min: 1, mix: 5})
    rating: number

    @Prop({type: String, trim: true})
    mcht_message?: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)