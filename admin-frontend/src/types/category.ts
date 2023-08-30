interface ICategoryPayload {
    name: string;
    image_ulr?: string
}


interface ICategories {
    data: ICategoryRow[]
    page: number
    per_page: number
    total: number
    total_page: number
}


interface ICategoryRow {
    catweb_id: string;
    name: string;
    image?: string;
}