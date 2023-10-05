import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PRODUCT })
export const postProduct = async (body: IProductPayload): Promise<void> => {
    await api.post(`/products`, body).then(
        (response) => response.data
    );
};

export const patchProduct = async (data: { prodId: string, body: IProductPayload }): Promise<void> => {
    await api.patch(`/products/${data.prodId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`).then(
        (response) => response.data
    );
};

export const getProducts = async (data: { page: number, per_page: number }): Promise<IProducts> => {
    return await api.get(`/merchants/products?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
// export const getProducts = async (data: { page: number, per_page: number }): Promise<IProducts> => {
//     return await api.get(`/products/owner?page=${data.page}&per_page=${data.per_page}`).then(
//         (response) => response.data
//     );
// };
export const getProductById = async (productId: string): Promise<IProductRow> => {
    return await api.get(`/products/owner/${productId}`).then(
        (response) => response.data
    );
};