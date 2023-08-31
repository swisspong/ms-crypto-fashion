

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
    cat_id: string;
    name: string;
    image?: string;
}
interface ICategoriesWeb {
    data: ICategoryWebRow[]
    page: number
    per_page: number
    total: number
    total_page: number
}


interface ICategoryWebRow {
    
    catweb_id: string;
    name: string;
    image?: string;
}