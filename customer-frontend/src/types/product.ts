interface IProductRow {
    prod_id: string
    name: string
    available: boolean
    sku: string
    stock: number
    description: string;
    price: number
    image_urls: string[]
    categories: ICategoryRow[]
    categories_web: ICategoryWebRow[]
    merchant: IMerchant
    groups: IGroup[]
    variants: IVariant[]
    payment_methods: string[]
    createdAt: string
    updatedAt: string
}

interface IProducts {
    data: IProductRow[]
    page: number
    per_page: number
    total: number
    total_page: number
}