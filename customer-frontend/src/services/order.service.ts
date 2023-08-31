import { API } from "@/lib/utils";

export const postOrder = async (body: IOrderPayload): Promise<void> => {
    return await API.post(`/orders`, body).then(
        (response) => response.data
    );
};
export const postOrderWallet = async (body: IOrderPayload): Promise<ICreateOrderWallet> => {
    return await API.post(`/orders`, body).then(
        (response) => response.data
    );
};
export const getMyOrders = async (data: { page: number, per_page: number }): Promise<IOrders> => {
    return await API.get(`/orders?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getMyOrderById = async (orderId: string): Promise<IOrderRow> => {
    return await API.get(`/orders/${orderId}`).then(
        (response) => response.data
    );
};
