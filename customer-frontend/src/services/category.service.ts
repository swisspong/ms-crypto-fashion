import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.CATEGORY })

export const getMyCategories = async (data: { page: number, per_page: number }): Promise<ICategories> => {
    return await api.get(`/categories/owner?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getAllCategoryByMerchantId = async (data: { mchtId: string | string[] | undefined, pagination: { page: number, per_page: number } }): Promise<ICategories> => {
    return await api.get(`/categories/merchant/${data.mchtId}?page=${data.pagination.page}&per_page=${data.pagination.per_page}`).then(
        (response) => response.data
    );
};

export const getCategorieMain = async (data: { page: number, per_page: number }): Promise<ICategoriesWeb> => {
    return await api.get(`/categories/web?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};