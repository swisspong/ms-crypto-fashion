import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Complaint } from "./schemas/complaints.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

@Injectable()
export class ComplaintsRepository extends AbstractRepository<Complaint> {
    protected readonly logger = new Logger(ComplaintsRepository.name); 

    constructor (
        @InjectModel(Complaint.name) complaintModel : Model<Complaint>,
        @InjectConnection() connection: Connection,
    ) {
        super(complaintModel, connection);
    }
}