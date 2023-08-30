import { API_PRODUCT } from "@/lib/utils";
export const getProductAll = async (data: { page: number, per_page: number, search?: string }): Promise<IProducts> => {
    return await API_PRODUCT.get(`products/?page=${data.page + 1}&per_page=${data.per_page}
    ${data.search && data.search.trim().length > 0 ? `&search=${data.search}` : ``}`).then(
        (response) => response.data
    );
};

export const deleteProduct = async (id: string): Promise<void> => {
    return await API_PRODUCT.delete(`products/${id}/advanced`).then((response) => response.data);
};