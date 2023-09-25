import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.ORDER })

export const getAllOrderByMerchant = async (data: { page: number, per_page: number }): Promise<IOrders> => {
    return await api.get(`/orders/merchant?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getMerchantOrderById = async (orderId: string): Promise<IOrderRow> => {
    return await api.get(`/orders/merchant/${orderId}`).then(
        (response) => response.data
    );
};
export const postFullfillment = async (data: { orderId: string, body: IFullfillmentPayload }): Promise<void> => {
    return await api.post(`/orders/${data.orderId}/fullfillment`, data.body).then(
        (response) => response.data
    );
};

export const merchantCancelOrder = async (orderId: string): Promise<void> => {
    return await api.post('/orders/merchant/cancel', { order_id: orderId }).then(
        (response) => response.data
    );
}
export const merchantRefundOrder = async (orderId: string): Promise<void> => {
    return await api.post('/orders/refund', { order_id: orderId }).then(
        (response) => response.data
    );
}

export const getOneOrderPolling = async (orderId: string): Promise<{ refetch: boolean }> => {
    return await api.get(`/orders/${orderId}/merchant/polling`).then(
        (response) => response.data
    );
};
