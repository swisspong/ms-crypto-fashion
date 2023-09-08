import { RoleFormat } from "../enums";


export interface CreateMerchantData {
    user_id: string;
    mcht_id: string;
    role: RoleFormat;
}

export interface DeleteMerchantData {
    mcht_id: string;
}