

interface IProduct {
    prod_id: string
    name: string
    available: boolean
    sku: string
    stock: number
    description: string;
    price: number
    image_urls: string[]
    categories: ICategoryRow[]
    merchant: IMerchant[]
    groups: IGroup[]
    variants: IVariant[]
    createdAt: string
    updatedAt: string
}

interface IProducts {
    data: IProduct[]
    page: number
    per_page: number
    total: number
    total_page: number
}