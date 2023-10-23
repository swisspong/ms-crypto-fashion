import { TypeFormat } from "./enums/complaint"

export interface TComplaintPlayload {
    prod_id?: string
    mcht_id?: string
    detail: string
    type: TypeFormat
}