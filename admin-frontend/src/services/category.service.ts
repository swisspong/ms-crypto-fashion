import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils"
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.CATEGORY})
export const postCategory = async (body: ICategoryPayload): Promise<void> => {
    return await api.post('categories/web', body).then(
        (response) => response.data
    )
}


export const getCategories = async (data: { pageIndex: number, pageSize: number }): Promise<ICategories> => {
    const result = await api.get(`categories/web?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const putCategory = async (data: {id: string, body: ICategoryPayload}): Promise<void> => {
    return await api.patch(`categories/web/${data.id}`, data.body).then((response) => response.data);
};

export const getCategoryById = async (catweb_id: string): Promise<ICategoryRow> => {
    return await api.get(`categories/web/${catweb_id}`).then(
        (response) => response.data
    );
};

export const deleteCategoryById = async (catweb_id: string): Promise<void> => {
    return await api.delete(`categories/web/${catweb_id}`).then(
        (response) => response.data
    )
}