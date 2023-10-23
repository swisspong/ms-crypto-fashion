import { Module } from "@nestjs/common";
import { ComplaintsController } from "./complaints.controller";
import { ComplaintsService } from "./complaints.service";
import { Complaint, ComplaintSchema } from "./schemas/complaints.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ComplaintsRepository } from "./complaints.repository";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Complaint.name, schema: ComplaintSchema}])
    ],
    controllers: [ComplaintsController],
    providers: [ComplaintsService, ComplaintsRepository],
    exports: [ComplaintsRepository]
})

export class ComplaintsModule {}