import { API } from "@/lib/utils";

export const postProduct = async (body: IProductPayload): Promise<void> => {
    await API.post(`/products`, body).then(
        (response) => response.data
    );
};

export const patchProduct = async (data: { prodId: string, body: IProductPayload }): Promise<void> => {
    await API.patch(`/products/${data.prodId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteProduct = async (id: string): Promise<void> => {
    await API.delete(`/products/${id}`).then(
        (response) => response.data
    );
};

export const getProducts = async (data: { page: number, per_page: number }): Promise<IProducts> => {
    return await API.get(`/products/owner?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getProductById = async (productId: string): Promise<IProductRow> => {
    return await API.get(`/products/owner/${productId}`).then(
        (response) => response.data
    );
};