import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import queryString from "query-string";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PRODUCT })

export const getMerchantProducts = async (data: { mchtId: string | string[] | undefined, page: number, per_page: number, catIds: string[], search?: string }): Promise<IProducts> => {
    return await api.get(`/merchants/${data.mchtId}/products?page=${data.page}&per_page=${data.per_page}${data.catIds.length > 0 ? `&${queryString.stringify({ cat_ids: data.catIds })}` : ``}${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`
    ).then(
        (response) => response.data
    );
};
// export const getMerchantProducts = async (data: { mchtId: string, pagination: { page: number, per_page: number } }): Promise<IProducts> => {
//     return await api.get(`/products/merchant/${data.mchtId}?page=${data.pagination.page}&per_page=${data.pagination.per_page}`).then(
//         (response) => response.data
//     );
// };
export const getProductById = async (prodId: string): Promise<IProductRow> => {
    return await api.get(`/products/${prodId}`).then(
        (response) => response.data
    );
};
export const getMyStoreFront = async (data: { page: number, per_page: number, catIds: string[], search?: string }): Promise<IProducts> => {
    return await api.get(`/merchants/store-front/products?page=${data.page}&per_page=${data.per_page}
    &store_front=true${data.catIds.length > 0 ? `&${queryString.stringify({ cat_ids: data.catIds })}` : ``}${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`).then(
        (response) => response.data
    );
};
// export const getMyStoreFront = async (data: { page: number, per_page: number, catIds: string[], search?: string }): Promise<IProducts> => {
//     return await api.get(`/products/owner/?page=${data.page}&per_page=${data.per_page}
//     &store_front=true${data.catIds.length > 0 ? `&${queryString.stringify({ cat_ids: data.catIds })}` : ``}${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`).then(
//         (response) => response.data
//     );
// };
export const getProductStorefrontById = async (productId: string): Promise<IProductRow> => {
    return await api.get(`/merchants/store-front/products/${productId}`).then(
        (response) => response.data
    );
};

export const getProducts = async (data: { page: number, per_page: number, catIds: string[], search?: string }): Promise<IProducts> => {
    return await api.get(`/products/?page=${data.page}&per_page=${data.per_page}
    &store_front=true${data.catIds.length > 0 ? `&${queryString.stringify({ cat_ids: data.catIds })}` : ``}${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`).then(
        (response) => response.data
    );
};

export const getProductsMerchants = async (data: { page: number, per_page: number, catIds: string[], search?: string, type_search: string | undefined }): Promise<IMerchants> => {
    return await api.get(`/products/merchants/?page=${data.page}&per_page=${data.per_page}
    &store_front=true${data.catIds.length > 0 ? `&${queryString.stringify({ cat_ids: data.catIds })}` : ``}${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}${data.type_search && data.type_search.trim().length > 0 ? `&type_search=${data.type_search}` : ``}`).then(
        (response) => response.data
    );
};