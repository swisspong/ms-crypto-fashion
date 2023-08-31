import { API } from "@/lib/utils";


export const getAllOrderByMerchant = async (data: { page: number, per_page: number }): Promise<IOrders> => {
    return await API.get(`/orders/merchant?page=${data.page}&per_page=${data.per_page}`).then(
        (response) => response.data
    );
};
export const getMerchantOrderById = async (orderId: string): Promise<IOrderRow> => {
    return await API.get(`/orders/merchant/${orderId}`).then(
        (response) => response.data
    );
};
export const postFullfillment = async (data: { orderId: string, body: IFullfillmentPayload }): Promise<void> => {
    return await API.post(`/orders/${data.orderId}/fullfillment`, data.body).then(
        (response) => response.data
    );
};

