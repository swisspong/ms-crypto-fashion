import { merchantCancelOrder, merchantRefundOrder, postFullfillment } from "@/src/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useFullfillmentOrder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { orderId: string, body: IFullfillmentPayload }) => postFullfillment(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["mcht-order"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["mcht-order"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["mcht-order"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["mcht-order"]);
            },
        }
    );
};
export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (orderId: string) => merchantCancelOrder(orderId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["mcht-order"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["mcht-order"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["mcht-order"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["mcht-order"]);
            },
        }
    );
};
export const useRefundOrder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (orderId: string) => merchantRefundOrder(orderId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["mcht-order"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["mcht-order"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["mcht-order"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["mcht-order"]);
            },
        }
    );
};