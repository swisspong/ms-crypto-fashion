import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.PRODUCT})
export const getProductAll = async (data: { page: number, per_page: number, search?: string }): Promise<IProducts> => {
    return await api.get(`products/?page=${data.page + 1}&per_page=${data.per_page}
    ${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`).then(
        (response) => response.data
    );
};

export const deleteProduct = async (id: string): Promise<void> => {
    return await api.delete(`products/${id}/advanced`).then((response) => response.data);
};