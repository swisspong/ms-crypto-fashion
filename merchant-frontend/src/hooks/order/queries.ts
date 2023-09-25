import { getAllOrderByMerchant, getMerchantOrderById, getOneOrderPolling } from "@/src/services/order.service";
import { useQuery } from "@tanstack/react-query";


export const useMerchantOrders = (data: { page: number, per_page: number }) => {
    return useQuery(["mcht-orders", data], () => getAllOrderByMerchant(data), {
        keepPreviousData: true
    });
};

export const useGetMerchantOrderById = (orderId?: string) => {
    return useQuery(["mcht-order", orderId], () => getMerchantOrderById(orderId!), {
        enabled: orderId ? true : false
    });
};

export const useGetOneOrderPolling = (orderId?: string) => {
    return useQuery(["mcht-order-polling"], () => getOneOrderPolling(orderId!), {
        enabled: orderId ? true : false
    });
};
