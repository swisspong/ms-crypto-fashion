// interface IProductRow {
//     // id: string;
//     // prod_id:string;
//     // name: string;
//     // image: string;
//     // price: number;
//     // stock: number;
//     // order: number;
//     // remaining: number

// }
interface IProductPayload {
    name: string
    sku: string
    stock: number
    price: number
    description: string
    image_urls: { url: string }[]
    categories: { cat_id: string }[]
    available: boolean
}
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