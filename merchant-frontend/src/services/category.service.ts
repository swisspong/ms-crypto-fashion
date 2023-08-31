import { API } from "@/lib/utils";



export const postCategory = async (body: ICategoryPayload): Promise<void> => {
    await API.post(`/categories`, body).then(
        (response) => response.data
    );
};

export const pathCategory = async (data: { catId: string, body: ICategoryPayload }): Promise<void> => {
    await API.patch(`/categories/${data.catId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteCategory = async (catId: string): Promise<void> => {
    await API.delete(`/categories/${catId}`).then(
        (response) => response.data
    );
};

export const getCategories = async (data: { page: number, per_page: number }): Promise<ICategories> => {
    return await API.get(`/categories/owner?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getCategorieMain = async (data: { page: number, per_page: number }): Promise<ICategoriesWeb> => {
    return await API.get(`/categories/web?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getCategoryById = async (catId: string): Promise<ICategoryRow> => {
    return await API.get(`/categories/owner/${catId}`).then(
        (response) => response.data
    );
};