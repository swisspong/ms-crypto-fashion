interface IMerchant {
    _id: string
    mcht_id: string
    name: string
    status: string
    banner_title: string
    banner_url: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface IMerchants {
    page: number
    per_page: number
    total: number
    total_page: number
    data: (IMerchant & { products: IProductRow[] })[]
}