import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Comment } from "./schemas/comment.schema";

@Injectable()
export class CommentsRepository extends AbstractRepository<Comment> {
    protected readonly logger = new Logger(CommentsRepository.name);

    constructor(
        @InjectModel(Comment.name) commentModel: Model<Comment>,
        @InjectConnection() connection: Connection
    ) {
        super(commentModel, connection)
    }
}