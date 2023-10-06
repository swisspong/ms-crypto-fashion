enum RoleFormat {
    USER = "user",
    MERCHANT = "merchant",
    ADMIN = "admin"
}



interface IUserRes {
    _id: string
    user_id: string
    username: string
    password: string
    email: string
    address:string
    role: RoleFormat
    permission: any[]
    createdAt: string
    updatedAt: string
    __v: number
    mcht_id: string
    cart: string
}

interface IMerchantRes {
    _id: string
    mcht_id: string
    name: string
    status: string
    banner_title: string
    banner_url?: string
    first_name: string
    last_name: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface IProfilePayload {
    username: string
}

interface IEmailPayload {
    email: string;
}