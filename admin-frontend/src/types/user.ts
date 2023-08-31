

interface IUserRes {
    _id: string
    user_id: string
    username: string
    password: string
    email: string
    role: string
    permission: permission[]
    createdAt: string
    updatedAt: string
    __v: number
    merchant: IMerchant
    cart: string
}