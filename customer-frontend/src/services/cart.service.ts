import { API } from "@/lib/utils";
import queryString from "query-string";

export const postCartByProdId = async (data: { prodId: string, body: ICartPayload }): Promise<void> => {
    await API.post(`/carts/${data.prodId}`, data.body).then(
        (response) => response.data
    );
};
export const pathcCartByItemId = async (data: { itemId: string, body: ICartPayload }): Promise<void> => {
    await API.patch(`/carts/${data.itemId}`, data.body).then(
        (response) => response.data
    );
};
export const deleteCartByItemId = async (itemId: string): Promise<void> => {
    await API.delete(`/carts/${itemId}`).then(
        (response) => response.data
    );
};
export const deleteManyItemInCart = async (body: IDeleteManyItem): Promise<void> => {
    await API.delete(`/carts/?${queryString.stringify({ items: body.items })}`).then(
        (response) => response.data
    );
};

export const getMyCarts = async (): Promise<ICartItem[]> => {
    return await API.get(`/carts`).then(
        (response) => response.data
    );
};
