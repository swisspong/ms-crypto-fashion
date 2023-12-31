export enum RoleFormat {
    USER = "user",
    MERCHANT = "merchant",
    ADMIN = "admin"
}

export interface IUserRes {
    _id: string
    user_id: string
    username: string
    password: string
    email: string
    role: RoleFormat
    permission: any[]
    createdAt: string
    updatedAt: string
    mcht_id: string
    __v: number
    merchant: IMerchantRes
    cart: string
}

export interface IMerchantRes {
    _id: string
    mcht_id: string
    name: string
    status: string
    banner_title: string
    banner_url: string
    first_name:string
    last_name:string
    createdAt: string
    updatedAt: string
    recp_id?:string;
    __v: number
}