import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import queryString from "query-string";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.CART })
export const postCartByProdId = async (data: { prodId: string, body: ICartPayload }): Promise<void> => {
    await api.post(`/carts/${data.prodId}`, data.body).then(
        (response) => response.data
    );
};
export const pathcCartByItemId = async (data: { itemId: string, body: ICartPayload }): Promise<void> => {
    await api.patch(`/carts/${data.itemId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteCartByItemId = async (itemId: string): Promise<void> => {
    await api.delete(`/carts/${itemId}`).then(
        (response) => response.data
    );
};
export const deleteManyItemInCart = async (body: IDeleteManyItem): Promise<void> => {
    await api.delete(`/carts/?${queryString.stringify({ items: body.items })}`).then(
        (response) => response.data
    );
};

export const getMyCarts = async (): Promise<ICartItem[]> => {
    return await api.get(`/carts`).then(
        (response) => response.data
    );
};
