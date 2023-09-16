import { getMyOrderById, getMyOrders, getOrdersPolling } from "@/src/services/order.service";
import { useQuery, useQueryClient } from "@tanstack/react-query"
export const useMyOrders = (data: { page: number, per_page: number }) => {
    const queryClient = useQueryClient();

    return useQuery(["orders", data], () => getMyOrders(data), {
        keepPreviousData: true,
        // onSuccess: () => {
        //     queryClient.invalidateQueries(["orders", data]);
        // }
    });
};


export const useGetOrderById = (orderId?: string) => {
    return useQuery(["order", orderId], () => getMyOrderById(orderId!), {
        enabled: orderId ? true : false
    });
};
export const useGetOrdersPolling = () => {
    return useQuery(["order-polling"], () => getOrdersPolling(), {
        
    });
};

