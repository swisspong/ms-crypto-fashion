import {  SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.CATEGORY })


export const postCategory = async (body: ICategoryPayload): Promise<void> => {
    await api.post(`/categories`, body).then(
        (response) => response.data
    );
};

export const pathCategory = async (data: { catId: string, body: ICategoryPayload }): Promise<void> => {
    await api.patch(`/categories/${data.catId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteCategory = async (catId: string): Promise<void> => {
    await api.delete(`/categories/${catId}`).then(
        (response) => response.data
    );
};

export const getCategories = async (data: { page: number, per_page: number }): Promise<ICategories> => {
    return await api.get(`/categories/owner?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getCategorieMain = async (data: { page: number, per_page: number }): Promise<ICategoriesWeb> => {
    return await api.get(`/categories/web?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getCategoryById = async (catId: string): Promise<ICategoryRow> => {
    return await api.get(`/categories/owner/${catId}`).then(
        (response) => response.data
    );
};