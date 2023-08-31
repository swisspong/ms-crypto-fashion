import { ForbiddenException, Injectable } from "@nestjs/common";
import ShortUniqueId from "short-unique-id";
import { ComplaintsRepository } from "./complaints.repository";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { StatusFormat, TypeFormat } from "./schemas/complaints.schema";
import { UpdateStatusDto } from "./dto/update-complaint.dto";

@Injectable()
export class ComplaintsService {
    private readonly uid = new ShortUniqueId()
    constructor(
        private readonly complaintsRepository: ComplaintsRepository,
    ) { }

    async create(createComplaintDto: CreateComplaintDto) {
        try {

            const { mcht_id, prod_id } = createComplaintDto
            let type: TypeFormat = undefined;

            //  check type complaint
            if (prod_id !== undefined) {
                type = TypeFormat.PRODUCT
            } else if (mcht_id !== undefined) {
                type = TypeFormat.MERCHANT
            } else {
                throw new ForbiddenException("Merchant is your!")
            }


            const complaint = await this.complaintsRepository.create({ comp_id: `complaint_${this.uid.stamp(15)}`, type, ...createComplaintDto })

            return complaint;
        } catch (error) {
            throw error
        }
    }

    async findAll(per_page: number, page: number) {
        try {

            const skip = (Number(page) - 1) * Number(per_page)
            const limit = per_page
            const complaints = await this.complaintsRepository.aggregate([
                {
                    $match: { status: { $ne: StatusFormat.CLOSING } }
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit
                },
            ])
            const total: { totalCount: number }[] = await this.complaintsRepository.aggregate([
                {
                    $match: { status: { $ne: StatusFormat.CLOSING } }
                },
                {
                    $count: 'totalCount'
                }

            ])

            let count = 0

            if (total.length > 0) count = total[0].totalCount
            return {
                page: Number(page),
                per_page: Number(per_page),
                total: count,
                total_page: Math.ceil(count / Number(per_page)),
                data: complaints,
            };
        } catch (error) {
            throw error
        }
    }

    async findOne(id: string) {
        try {
            const complaint = await this.complaintsRepository.findOne({ comp_id: id })
            return complaint;
        } catch (error) {
            throw error
        }
    }

    async update(id: string, updateComplaintDto: UpdateStatusDto) {
        try {
            const { status } = updateComplaintDto;

            const complaint = await this.complaintsRepository.findOneAndUpdate({ comp_id: id }, { status })
            return complaint

        } catch (error) {
            throw error
        }
    }



}