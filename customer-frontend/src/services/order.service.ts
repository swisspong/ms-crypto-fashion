import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.ORDER })
export const postOrder = async (body: IOrderPayload): Promise<void> => {
    return await api.post(`/orders`, body).then(
        (response) => response.data
    );
};
export const postOrderWallet = async (body: IOrderPayload): Promise<ICreateOrderWallet> => {
    return await api.post(`/orders`, body).then(
        (response) => response.data
    );
};
export const getOrderWalletByCheckoutId = async (chktId: string): Promise<IOrderWalletResponse> => {
    return await api.get(`/orders/checkout/${chktId}`).then(
        (response) => response.data
    );
};
export const getMyOrders = async (data: { page: number, per_page: number }): Promise<IOrders> => {
    return await api.get(`/orders?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getMyOrderById = async (orderId: string): Promise<IOrderRow> => {
    return await api.get(`/orders/${orderId}`).then(
        (response) => response.data
    );
};
export const getOrdersPolling = async (): Promise<{ refetch: boolean }> => {
    return await api.get(`/orders/polling`).then(
        (response) => response.data
    );
};

export const getOrderByIdPolling = async (orderId: string): Promise<{ refetch: boolean }> => {
    return await api.get(`/orders/${orderId}/polling`).then(
        (response) => response.data
    );
};
export const cancelOrder = async (orderId: string): Promise<void> => {
    return await api.post('/orders/cancel', { order_id: orderId }).then(
        (response) => response.data
    );
}

export const receiveOrderReq = async (orderId: string): Promise<void> => {
    return await api.post(`/orders/${orderId}/receive`, null).then(
        (response) => response.data
    );
}

export const deleteOrderWalletError = async (body: IOrderWalletError) => {
    return await api.post(`/orders/error`, body).then(response => response.data)
}