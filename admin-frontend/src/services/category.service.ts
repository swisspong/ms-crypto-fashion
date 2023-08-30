import { API_PRODUCT } from "@/lib/utils"

export const postCategory = async (body: ICategoryPayload): Promise<void> => {
    return await API_PRODUCT.post('categories/web', body).then(
        (response) => response.data
    )
}


export const getCategories = async (data: { pageIndex: number, pageSize: number }): Promise<ICategories> => {
    const result = await API_PRODUCT.get(`categories/web?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const putCategory = async (data: {id: string, body: ICategoryPayload}): Promise<void> => {
    return await API_PRODUCT.patch(`categories/web/${data.id}`, data.body).then((response) => response.data);
};

export const getCategoryById = async (catweb_id: string): Promise<ICategoryRow> => {
    return await API_PRODUCT.get(`categories/web/${catweb_id}`).then(
        (response) => response.data
    );
};

export const deleteCategoryById = async (catweb_id: string): Promise<void> => {
    return await API_PRODUCT.delete(`categories/web/${catweb_id}`).then(
        (response) => response.data
    )
}