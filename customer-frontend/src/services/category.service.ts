import { API } from "@/lib/utils";

export const getMyCategories = async (data: { page: number, per_page: number }): Promise<ICategories> => {
    return await API.get(`/categories/owner?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getAllCategoryByMerchantId = async (data: { mchtId: string, pagination: { page: number, per_page: number } }): Promise<ICategories> => {
    return await API.get(`/categories/merchant/${data.mchtId}?page=${data.pagination.page}&per_page=${data.pagination.per_page}`).then(
        (response) => response.data
    );
};

export const getCategorieMain = async (data: { page: number, per_page: number }): Promise<ICategoriesWeb> => {
    return await API.get(`/categories/web?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};